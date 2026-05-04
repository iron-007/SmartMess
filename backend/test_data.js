const mongoose = require('mongoose');
const User = require('./models/user');
const moment = require('moment-timezone');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartmess');
  
  const students = await User.find({ role: 'student' }).select('messStatus lastRequestDate');
  console.log("Total students:", students.length);
  const open = students.filter(s => s.messStatus === 'Open').length;
  console.log("Open:", open);
  const closed = students.filter(s => s.messStatus === 'Closed').length;
  console.log("Closed:", closed);
  
  mongoose.connection.close();
}
test();
