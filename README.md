# SmartMess Management System

SmartMess Management System is a comprehensive web application designed to streamline and automate the operations of a student mess or hostel dining facility. It provides distinct interfaces for both students and the mess administrators (butlers), facilitating efficient communication, account management, menu tracking, and overall operational oversight.

## 🚀 Features

### For Students
*   **Student Dashboard**: A personalized hub to view all mess-related information.
*   **Mess Status Management**: Toggle mess status (Open/Closed) based on availability or leave, which helps the administration calculate food requirements accurately.
*   **Weekly Menu Viewer**: Access the daily breakfast, lunch, snacks, and dinner menus.
*   **Notice Board**: Stay updated with the latest announcements, rules, or changes from the administration.
*   **Dues & Accounts**: Track current dues, monthly bills, and payment history.
*   **Profile Management**: Update personal details and contact information.

### For Butlers (Operations)
*   **Butler Command Center**: A powerful dashboard for daily operational management.
*   **Real-Time Analytics**: Visual breakdown of active vs. inactive mess accounts using interactive charts.
*   **Closed Accounts Tracking**: Monitor which students have paused their mess accounts.
*   **Extras & Guest Management**: Add extra meals or guest charges to specific student accounts with a high-performance search interface.
*   **Notice Creation**: Broadcast important announcements to all students using a rich text editor.

### For Administrators (Settings & Oversight)
*   **Menu Management**: Update the daily and weekly menu dynamically.
*   **Dynamic Pricing Control**: Configure the daily base mess rate and prices for extras/guests.
*   **Student Directory & Management**: Complete view of all registered students, their attendance, consumption records, and the ability to update their details.
*   **Billing & Ledger Control**: Supervise and manually trigger the daily billing and ledger calculations.
*   **Notice Board Oversight**: Full access to the notice board for global announcements.

## 📁 Project Structure

The project follows a standard client-server architecture, separated into `frontend` and `backend` directories.

```text
smartmess-management/
├── backend/                  # Node.js/Express server
│   ├── config/               # Configuration settings
│   ├── controllers/          # API endpoint logic
│   ├── models/               # Mongoose database schemas (User, Notice, Menu, etc.)
│   ├── routes/               # Express route definitions
│   ├── scripts/              # Database seeding scripts (seedMenu, seedNotices, etc.)
│   ├── uploads/              # Local file upload storage
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
│
├── frontend/                 # React frontend application (Vite)
│   ├── public/               # Static assets
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable UI components (NoticeBoard, WeeklyMenuSection, etc.)
│   │   ├── pages/            # Main page views (ButlerDashboard, etc.)
│   │   ├── App.jsx           # Main application component & routing
│   │   └── main.jsx          # React DOM render entry
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite bundler configuration
│   └── package.json          # Frontend dependencies
│
└── README.md                 # Project documentation
```

## 🛠️ Technology Stack & Dependencies

### Backend (`/backend`)
The backend is built with **Node.js** and **Express**, utilizing **MongoDB** for data persistence.
*   **express**: Web framework for building the RESTful API.
*   **mongoose**: ODM (Object Data Modeling) library for MongoDB.
*   **bcryptjs**: Password hashing for secure user authentication.
*   **jsonwebtoken**: Generating and verifying JWTs for API authorization.
*   **cors**: Middleware to enable Cross-Origin Resource Sharing.
*   **dotenv**: Environment variable management.
*   **multer** & **cloudinary**: Handling file/image uploads and cloud storage.
*   **moment-timezone**: Handling timezone-specific date and time formatting.
*   **node-cron**: Task scheduler for background jobs (like daily status resets or automated billing).

### Frontend (`/frontend`)
The frontend is a single-page application (SPA) built with **React** and bundled using **Vite**.
*   **react** & **react-dom**: Core UI library.
*   **react-router-dom**: Client-side routing for navigating between dashboards and pages.
*   **axios**: Promise-based HTTP client for making requests to the backend API.
*   **bootstrap**: CSS framework for responsive layout and styling.
*   **recharts**: Composable charting library for rendering dashboard analytics (like the Monthly Status Breakdown).
*   **quill**: Rich text editor used for creating formatted notices.
*   **jspdf** & **jspdf-autotable**: Generating downloadable PDF reports (e.g., student lists, invoices).
*   **moment-timezone**: Timezone-aware date parsing and formatting on the client side.

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB instance (local or Atlas)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` root and configure variables (e.g., `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_URL`).
4. (Optional) Run seed scripts to populate initial data: `node scripts/seedMenu.js`, etc.
5. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Access the application in your browser at `http://localhost:5173` (or the port specified by Vite).

## 🌐 Live Demo & Deployment

The application is deployed and can be accessed live at:
**[SmartMess Management System](https://smart-mess-blond.vercel.app/)**

*   **Frontend**: Deployed and hosted on **Vercel** for optimal performance and fast global delivery.
*   **Backend**: The Node.js/Express REST API is hosted on **Render**.
