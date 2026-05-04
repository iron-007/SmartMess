const mongoose = require('mongoose');
const User = require('./backend/models/user');
const moment = require('moment-timezone');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartmess', { useNewUrlParser: true, useUnifiedTopology: true });
  
  const students = await User.find({ role: 'student' }).select('messStatus lastRequestDate');
  console.log("Total students:", students.length);
  const open = students.filter(s => s.messStatus === 'Open').length;
  console.log("Open:", open);
  
  mongoose.connection.close();
}
test();
