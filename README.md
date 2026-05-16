# 🏥 Hospital Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react)
![Node](https://img.shields.io/badge/backend-Node.js-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/styling-Tailwind_CSS-38B2AC?logo=tailwind-css)

A professional, full-stack Hospital Management System designed to streamline hospital operations, manage patient records, and coordinate appointments across multiple user roles.

---

## 🔗 Live Demo
Check out the live application:  
👉 **[Hospital Management System Live](https://hospital-management-system-endrias.vercel.app)**

---

## ✨ Features

### 🔐 Authentication & Security
- Secure login and registration with **JWT** and **bcrypt**.
- **Role-Based Access Control (RBAC)** for Admin, Doctor, and Patient.
- Protected routes and session persistence via **Zustand**.

### 👤 User Roles
- **Admin**: Manage all users (Patients/Doctors), view global statistics, and oversee system health.
- **Doctor**: Manage availability, view assigned appointments, and update patient medical records/prescriptions.
- **Patient**: Book appointments, view personal medical history, and manage profile information.

### 📅 Core Functionality
- **Appointment System**: Real-time booking with status tracking (Pending, Approved, Completed, Cancelled).
- **Medical Records**: Digital storage and retrieval of patient medical history.
- **Prescription Management**: Doctors can issue and manage digital prescriptions.
- **Reminders**: Automated notifications and background jobs via **Trigger.dev**.
- **Modern UI**: Responsive, high-performance interface built with **Vite** and **Tailwind CSS**.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Lucide React, Zustand |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js |
| **Data Fetching** | TanStack Query (React Query), Axios |
| **Reminders** | Trigger.dev, Resend API |

---

## 🏗️ System Architecture

The application follows a **Client-Server architecture**:
1.  **Frontend**: A Single Page Application (SPA) that communicates with the API via Axios.
2.  **Backend**: A RESTful API handling business logic, authentication, and database interactions.
3.  **Database**: NoSQL database (MongoDB) storing relational-like data through Mongoose schemas.
4.  **Background Jobs**: Trigger.dev handles asynchronous tasks like email reminders.

---

## 📂 Folder Structure

```text
hospital-management-system/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/          # Axios API configurations
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main application views
│   │   ├── store/        # Zustand state management
│   │   └── hooks/        # Custom React Query hooks
│   └── public/           # Static assets
├── server/                # Backend (Node + Express)
│   ├── controllers/      # Route logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoint definitions
│   ├── middleware/       # Auth & Error handlers
│   └── config/           # DB and external service configs
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- Git

### 1. Clone the repository
```bash
git clone https://github.com/EndriasEshetu/Hospital-management-system.git
cd Hospital-management-system
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
TRIGGER_SECRET_KEY=your_trigger_secret
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running Locally

### Start Backend
```bash
cd server
npm run dev
```

### Start Frontend
```bash
cd client
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🔑 Authentication Flow
1. User submits credentials to `/api/auth/login`.
2. Backend verifies with **bcrypt** and generates a **JWT**.
3. JWT is returned to the client and stored via **Zustand**.
4. Client includes the token in the `Authorization` header for all subsequent requests via an Axios interceptor.

---

## 📡 API Endpoints (Overview)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & get token |
| `GET` | `/api/appointments` | Get appointments (role-filtered) |
| `POST` | `/api/appointments` | Book a new appointment |
| `PATCH` | `/api/appointments/:id` | Update appointment status |
| `GET` | `/api/doctors` | List all doctors |
| `GET` | `/api/patients/:id` | Get patient profile & records |

---

## 🖼️ Screenshots
*Placeholders for your UI screenshots*
- [ ] Dashboard Overview
- [ ] Appointment Booking
- [ ] Patient Records View

---

## 🌍 Deployment Guide

### Frontend (Vercel)
1. Import the repository.
2. Set root directory to `client`.
3. Add `VITE_API_URL` to environment variables.
4. Deploy.

### Backend (Render)
1. Create a new Web Service.
2. Set root directory to `server`.
3. Add all `.env` variables (ensure `CLIENT_URL` matches your Vercel URL).
4. Deploy.

---

## 🔮 Future Improvements
- [ ] Video consultation integration (WebRTC).
- [ ] Multi-language support (i18n).
- [ ] Mobile application (React Native).
- [ ] Advanced analytics dashboard for hospital management.

---

## ❓ Troubleshooting
- **CORS Errors**: Ensure the `CLIENT_URL` in the backend environment matches your frontend URL exactly.
- **DB Connection**: Verify that your IP is whitelisted in MongoDB Atlas.
- **Reminders Not Working**: Ensure your Trigger.dev worker is running or the secret keys are correct.

---

## 🤝 Contributors
- **Endrias Eshetu** - *Lead Developer* - [GitHub](https://github.com/EndriasEshetu)

---

## 📄 License
This project is licensed under the ISC License.
