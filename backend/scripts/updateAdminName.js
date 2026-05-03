const mongoose = require('mongoose');
const User = require('../models/user');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const updateAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const result = await User.findOneAndUpdate(
      { role: 'admin' },
      { name: 'Anand Raj' },
      { new: true }
    );

    if (result) {
      console.log(`Admin name updated successfully to: ${result.name}`);
    } else {
      console.log("No user with role 'admin' was found in the database.");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating admin:", error.message);
    process.exit(1);
  }
};

updateAdmin();
