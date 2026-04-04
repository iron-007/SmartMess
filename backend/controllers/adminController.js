const Menu = require('../models/Menu');
const Pricing = require('../models/Pricing');
const User = require('../models/user');
const Leave = require('../models/leave');
const Transaction = require('../models/transaction'); 
// --- Menu Controllers ---
exports.getMenu = async (req, res) => {
  try {
    // Assuming a single configuration document for the weekly menu
    let menuData = await Menu.findOne();
    if (!menuData) {
      return res.status(200).json({}); // Frontend will use initial defaults
    }
    res.status(200).json(menuData);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Server error fetching menu' });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { menu, timings, status } = req.body;
    let menuData = await Menu.findOne();
    
    if (menuData) {
      menuData.menu = menu;
      menuData.timings = timings;
      menuData.status = status;
      await menuData.save();
    } else {
      menuData = new Menu({ menu, timings, status });
      await menuData.save();
    }
    
    res.status(200).json({ message: 'Menu updated successfully', menuData });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Server error updating menu' });
  }
};

// --- Pricing Controllers ---
exports.getPricing = async (req, res) => {
  try {
    let pricingData = await Pricing.findOne();
    if (!pricingData) {
      return res.status(200).json({}); // Frontend will use initial defaults
    }
    res.status(200).json({
      pricing: {
        baseFee: pricingData.baseFee,
        student: pricingData.student,
        guest: pricingData.guest,
        rules: pricingData.rules
      },
      auditLog: pricingData.auditLog
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ message: 'Server error fetching pricing' });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    const pricingPayload = req.body;
    let pricingData = await Pricing.findOne();
    
    const newLogEntry = {
      date: new Date().toISOString().split('T')[0],
      action: 'Updated pricing and rules',
      admin: req.user ? req.user.name : 'System Admin' // Fallback if req.user is undefined
    };

    if (pricingData) {
      pricingData.baseFee = pricingPayload.baseFee;
      pricingData.student = pricingPayload.student;
      pricingData.guest = pricingPayload.guest;
      pricingData.rules = pricingPayload.rules;
      // Push new log to top and keep only the latest 20 logs
      pricingData.auditLog.unshift(newLogEntry);
      if (pricingData.auditLog.length > 20) pricingData.auditLog.pop();
      
      await pricingData.save();
    } else {
      pricingData = new Pricing({
        ...pricingPayload,
        auditLog: [newLogEntry]
      });
      await pricingData.save();
    }
    
    res.status(200).json({ message: 'Pricing updated successfully', auditLog: pricingData.auditLog });
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({ message: 'Server error updating pricing' });
  }
};

// --- Student Management ---
exports.getAllStudents = async (req, res) => {
  try {
    // POINT 1: Dynamic Calendar - Get exact days for the current month/year
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // POINT 2: True Per-Meal Pricing - Ignore baseFee, sum the meals
    const pricingData = await Pricing.findOne();
    // If pricing exists, add B + L + D. Otherwise, fallback to a default (e.g., 40+50+50 = 140)
    const dailyCost = (pricingData && pricingData.student) 
      ? (pricingData.student.breakfast + pricingData.student.lunch + pricingData.student.dinner) 
      : 140; 

    // Fetch all students
    const students = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });

    // Process each student to generate the Grid Data
    const processedStudents = await Promise.all(students.map(async (student) => {
      
      let monthlyStatus = Array(daysInMonth).fill(true);

      // Fetch approved leaves
      const studentLeaves = await Leave.find({
        student: student._id,
        status: 'Approved',
        $or: [
          { startDate: { $gte: new Date(currentYear, currentMonth, 1), $lte: new Date(currentYear, currentMonth, daysInMonth) } },
          { endDate: { $gte: new Date(currentYear, currentMonth, 1), $lte: new Date(currentYear, currentMonth, daysInMonth) } },
          { startDate: { $lt: new Date(currentYear, currentMonth, 1) }, endDate: { $gt: new Date(currentYear, currentMonth, daysInMonth) } }
        ]
      });

      // Turn days to False based on leaves
      studentLeaves.forEach(leave => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);

        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(currentYear, currentMonth, day);
          currentDate.setHours(0,0,0,0);
          const leaveStart = new Date(start).setHours(0,0,0,0);
          const leaveEnd = new Date(end).setHours(0,0,0,0);

          if (currentDate >= leaveStart && currentDate <= leaveEnd) {
            monthlyStatus[day - 1] = false; 
          }
        }
      });

      // Calculate the base bill (Active Days * Sum of Meals)
      const activeDaysCount = monthlyStatus.filter(day => day === true).length;
      let currentMonthBill = activeDaysCount * dailyCost;

      // POINT 2 (Continued): Add any "Extra" food or guest transactions from this month
      const extraTransactions = await Transaction.find({
        student: student._id,
        type: 'Extra', // Finding all extra purchases
        date: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lte: new Date(currentYear, currentMonth, daysInMonth, 23, 59, 59)
        }
      });

      // Sum up the extra charges and add them to the bill
      const extraCharges = extraTransactions.reduce((total, trans) => total + trans.amount, 0);
      currentMonthBill += extraCharges;

      return {
        _id: student._id,
        name: student.name,
        messAccount: student.messAccount || 'N/A',
        year: student.year || 'N/A',
        urn: student.urn || 'N/A',
        crn: student.crn || 'N/A',
        department: student.department || 'N/A',
        phone: student.phone || 'N/A',
        monthlyStatus: monthlyStatus,
        currentMonthBill: currentMonthBill,
        previousDues: student.previousDues || 0
      };
    }));

    // Send daysInMonth to the frontend so it knows how many columns to draw!
    res.status(200).json({ success: true, daysInMonth: daysInMonth, students: processedStudents });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Server error fetching students' });
  }
};