const dotenv = require('dotenv');
// Load env variables before requiring other local files
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const studentRoutes = require('./routes/studentRoutes');

// NEW: Import cron and your admin controller for the automation
const cron = require('node-cron');
const adminController = require('./controllers/adminController');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', adminRoutes);
app.use('/api/admin/notices', noticeRoutes);
app.use('/api/students', studentRoutes);

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('SmartMess API is running...');
});

// --- AUTOMATION: The Midnight Ledger ---
// Schedule: '59 23 * * *' means 11:59 PM, every single day.
cron.schedule('59 23 * * *', async () => {
  console.log('--- [SYSTEM] Triggering Automated Midnight Ledger ---');
  try {
    // We run the function directly without passing a request/response 
    await adminController.processDailyBilling(); 
  } catch (err) {
    console.error('--- [SYSTEM] Midnight Ledger Automation Failed:', err);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});