const User = require("../models/user");
const MessRequest = require("../models/messRequest");
const Attendance = require("../models/attendance");
const Transaction = require("../models/transaction");
const Pricing = require("../models/Pricing");
const Leave = require("../models/leave");
const moment = require("moment-timezone");

// @desc    Get all pending permanent account requests
// @route   GET /api/butler/approvals
// @access  Butler/Admin
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingStudents = await User.find({ role: 'student', isApproved: false }).select('-password');
    res.status(200).json(pendingStudents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching approvals", error: error.message });
  }
};

// @desc    Approve a student account
// @route   PUT /api/butler/approvals/:id/approve
// @access  Butler/Admin
exports.approveAccount = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { returnDocument: 'after' });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Account approved successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error approving account", error: error.message });
  }
};

// @desc    Reject/Delete a student registration
// @route   DELETE /api/butler/approvals/:id/reject
// @access  Butler/Admin
exports.rejectAccount = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Registration rejected and deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting account", error: error.message });
  }
};

// @desc    Get current student bills for high-balance alerts
// @route   GET /api/butler/student-bills
// @access  Butler/Admin
exports.getStudentBills = async (req, res) => {
  try {
    const now = moment().tz('Asia/Kolkata');
    const startOfMonth = now.clone().startOf('month').toDate();
    const endOfMonth = now.clone().endOf('month').toDate();

    const students = await User.find({ role: 'student' }).select('name messAccount previousDues');

    // Fetch all transactions for the month at once for efficiency
    const allTransactions = await Transaction.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const studentBills = students.map(student => {
      const studentTx = allTransactions.filter(t => t.student.toString() === student._id.toString());

      let dailyMealsTotal = 0;
      let extraTotal = 0;
      let guestTotal = 0;
      let fineTotal = 0;
      let paymentsTotal = 0;
      let rebateTotal = 0;

      studentTx.forEach(trans => {
        const amount = Math.abs(trans.amount || 0);
        if (trans.type === 'DailyMeals') dailyMealsTotal += amount;
        if (trans.type === 'Extra') extraTotal += amount;
        if (trans.type === 'Guest') guestTotal += amount;
        if (trans.type === 'Fine') fineTotal += amount;
        if (trans.type === 'Rebate') rebateTotal += amount;
        if (trans.type === 'Payment') paymentsTotal += amount;
      });

      // currentMonthTotal: Represents the base Monthly Mess Bill (Daily Meals)
      // totalPayable: (Prev Dues + Daily Meals + Extras + Guest + Fine) - (Payments + Rebates)
      const totalPayable = (student.previousDues || 0) + 
                           (dailyMealsTotal + extraTotal + guestTotal + fineTotal) - 
                           (paymentsTotal + rebateTotal);

      return {
        _id: student._id,
        name: student.name,
        messAccount: student.messAccount,
        totalPayable,
        currentMonthTotal: dailyMealsTotal, // Now specifically shows the base monthly bill
        previousDues: student.previousDues || 0,
        extraTotal,
        guestTotal,
        dailyMealsTotal,
        fineTotal,
        rebateTotal,
        paymentsTotal
      };
    });

    res.status(200).json({ success: true, bills: studentBills });
  } catch (error) {
    console.error("Error fetching student bills:", error);
    res.status(500).json({ success: false, message: "Server error fetching bills" });
  }
};

// @desc    Get daily active/inactive student counts for the current month (Graph Data)
// @route   GET /api/butler/status-stats
// @access  Butler/Admin
exports.getMonthlyStatusStats = async (req, res) => {
  try {
    const { year, month } = req.query; // Month is 1-12
    const now = moment().tz('Asia/Kolkata');
    const targetYear = year ? parseInt(year) : now.year();
    const targetMonth = month ? parseInt(month) - 1 : now.month();

    const startDate = moment.tz([targetYear, targetMonth, 1], 'Asia/Kolkata').startOf('day');
    const endDate = startDate.clone().endOf('month');
    const daysInMonth = startDate.daysInMonth();

    const students = await User.find({ role: 'student' }).select('messStatus lastRequestDate');
    const allRequests = await MessRequest.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      status: 'APPROVED'
    });
    const allLeaves = await Leave.find({
      status: 'Approved',
      $or: [
        { startDate: { $lte: endDate.toDate() }, endDate: { $gte: startDate.toDate() } }
      ]
    });

    const dailyStats = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dMoment = startDate.clone().date(d);
      let activeCount = 0;
      let inactiveCount = 0;

      students.forEach(student => {
        const lastChange = student.lastRequestDate ? moment.tz(student.lastRequestDate, 'Asia/Kolkata').startOf('day') : null;
        let isActive = true;

        // 1. History-based status
        if (lastChange) {
          if (student.messStatus === 'Closed') {
            isActive = dMoment.isSameOrAfter(lastChange) ? false : true;
          } else {
            isActive = dMoment.isSameOrAfter(lastChange) ? true : false;
          }
        } else {
          isActive = student.messStatus === 'Open';
        }

        // 2. Daily Overrides (Approved Only)
        const dayRequest = allRequests.find(r =>
          r.student.toString() === student._id.toString() &&
          moment.tz(r.date, 'Asia/Kolkata').startOf('day').isSame(dMoment, 'day')
        );
        if (dayRequest) {
          isActive = dayRequest.action === 'OPEN';
        }

        // 3. Leaves
        const onLeave = allLeaves.some(l =>
          l.student.toString() === student._id.toString() &&
          dMoment.isSameOrAfter(moment.tz(l.startDate, 'Asia/Kolkata').startOf('day')) &&
          dMoment.isSameOrBefore(moment.tz(l.endDate, 'Asia/Kolkata').startOf('day'))
        );
        if (onLeave) isActive = false;

        if (isActive) activeCount++;
        else inactiveCount++;
      });

      dailyStats.push({
        day: d,
        date: dMoment.format('MMM DD'),
        active: activeCount,
        inactive: inactiveCount
      });
    }

    res.status(200).json({ success: true, stats: dailyStats });
  } catch (error) {
    console.error("Error fetching status stats:", error);
    res.status(500).json({ success: false, message: "Server error fetching stats" });
  }
};

// @desc    Get live attendance counts for today
// @route   GET /api/butler/live-attendance
// @access  Butler/Admin
exports.getLiveAttendance = async (req, res) => {
  try {
    const today = moment().tz('Asia/Kolkata').startOf('day').toDate();
    const tomorrow = moment().tz('Asia/Kolkata').endOf('day').toDate();

    const stats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: "$mealType",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      breakfastCount: 0,
      lunchCount: 0,
      dinnerCount: 0,
      totalServed: 0
    };

    stats.forEach(item => {
      if (item._id === 'Breakfast') result.breakfastCount = item.count;
      if (item._id === 'Lunch') result.lunchCount = item.count;
      if (item._id === 'Dinner') result.dinnerCount = item.count;
      result.totalServed += item.count;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching live attendance", error: error.message });
  }
};

// @desc    Get monthly attendance breakdown
// @route   GET /api/butler/attendance?month=MM&year=YYYY
// @access  Butler/Admin
exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ message: "Month and Year required" });

    const startDate = moment.tz([year, month - 1, 1], 'Asia/Kolkata').startOf('month').toDate();
    const endDate = moment.tz([year, month - 1, 1], 'Asia/Kolkata').endOf('month').toDate();

    const stats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            mealType: "$mealType"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          meals: {
            $push: {
              mealType: "$_id.mealType",
              count: "$count"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedResults = stats.map(day => {
      const dayObj = {
        date: day._id,
        breakfastCount: 0,
        lunchCount: 0,
        dinnerCount: 0
      };
      day.meals.forEach(m => {
        if (m.mealType === 'Breakfast') dayObj.breakfastCount = m.count;
        if (m.mealType === 'Lunch') dayObj.lunchCount = m.count;
        if (m.mealType === 'Dinner') dayObj.dinnerCount = m.count;
      });
      return dayObj;
    });

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};

// @desc    Mark attendance for a student
// @route   POST /api/butler/mark-attendance
// @access  Butler/Admin
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, mealType } = req.body;
    const today = moment().tz('Asia/Kolkata').startOf('day').toDate();

    // Check if already marked
    const existing = await Attendance.findOne({
      student: studentId,
      date: today,
      mealType
    });

    if (existing) return res.status(400).json({ message: "Attendance already marked for this meal" });

    // Check if student exists and is Open
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.messStatus === 'Closed') {
      return res.status(400).json({ message: "Account is Closed. Cannot mark attendance." });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date: today,
      mealType,
      timestamp: new Date()
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
};

// @desc    Get students for Butler (Search/List)
// @route   GET /api/butler/students
// @access  Butler/Admin
exports.getButlerStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name messAccount messStatus');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

// @desc    Add manual consumption (Extra/Guest)
// @route   POST /api/butler/add-consumption
// @access  Butler/Admin
exports.addConsumption = async (req, res) => {
  try {
    const { studentId, extras, guestMeals, mealType } = req.body;
    const now = moment().tz('Asia/Kolkata');
    const today = now.clone().startOf('day').toDate();

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.messStatus === 'Closed') {
      return res.status(400).json({ message: "Account is Closed. Cannot add consumption." });
    }

    const activePricing = await Pricing.findOne();
    if (!activePricing) return res.status(404).json({ message: "Pricing not configured" });

    const transactions = [];

    // 1. Process Extras
    if (extras && Array.isArray(extras)) {
      const extraPriceMap = activePricing.extraPrices || new Map();
      extras.forEach(extra => {
        if (!extra.item) return;
        const itemName = extra.item;
        const qty = parseInt(extra.quantity) || 1;
        const pricePerUnit = extraPriceMap.get(itemName) || 0;

        transactions.push({
          student: studentId,
          date: today,
          type: 'Extra',
          description: `Extra: ${itemName} (Qty: ${qty})`,
          amount: pricePerUnit * qty,
          mealType: mealType || 'N/A'
        });
      });
    }

    // 2. Process Guest Meals
    if (guestMeals && guestMeals > 0) {
      const mealKey = (mealType || 'Lunch').toLowerCase();
      const guestPrice = activePricing.guest[mealKey] || activePricing.guest.lunch || 50;

      for (let i = 0; i < guestMeals; i++) {
        transactions.push({
          student: studentId,
          date: today,
          type: 'Guest',
          description: `Guest Meal: ${mealType || 'Lunch'}`,
          amount: guestPrice,
          mealType: mealType || 'Lunch'
        });
      }
    }

    if (transactions.length > 0) {
      await Transaction.insertMany(transactions);
    }

    res.status(201).json({ success: true, message: "Consumption added successfully", count: transactions.length });
  } catch (error) {
    console.error("Error adding consumption:", error);
    res.status(500).json({ message: "Error adding consumption", error: error.message });
  }
};
// @desc    Get consumption history for extras and guests
// @route   GET /api/butler/consumption-history
// @access  Butler/Admin
exports.getConsumptionHistory = async (req, res) => {
  try {
    const { day, mealType } = req.query;
    const now = moment().tz('Asia/Kolkata');
    const startOfMonth = now.clone().startOf('month').toDate();
    const endOfMonth = now.clone().endOf('month').toDate();

    let query = {
      type: { $in: ['Extra', 'Guest'] },
      date: { $gte: startOfMonth, $lte: endOfMonth }
    };

    if (day) {
      const targetDate = now.clone().date(parseInt(day)).startOf('day').toDate();
      const nextDate = now.clone().date(parseInt(day)).endOf('day').toDate();
      query.date = { $gte: targetDate, $lte: nextDate };
    }

    if (mealType && mealType !== 'All') {
      query.mealType = mealType;
    }

    const history = await Transaction.find(query)
      .populate('student', 'name messAccount')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Error fetching consumption history:", error);
    res.status(500).json({ message: "Error fetching consumption history", error: error.message });
  }
};
