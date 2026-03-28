const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  morning: { type: String, default: 'Not Set' },
  afternoon: { type: String, default: 'Not Set' },
  evening: { type: String, default: 'Not Set' }
});

const menuSchema = new mongoose.Schema({
  weekStartDate: { type: Date, required: true },
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);