# 🏥 Hospital Management System (MERN Stack)

A full-stack **Hospital Management System** built using the **MERN stack** that allows patient registration, appointment booking, and automated email confirmation.

---

## 🚀 Features

- 👤 Patient Registration
- 🗓️ Doctor Appointment Booking
- 📧 Email Confirmation using Nodemailer
- ⏰ Time Slot Selection
- 📋 Appointment Summary
- 🔒 Environment Variable Configuration
- 🌐 RESTful APIs

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Nodemailer
- dotenv

---

## 📁 Project Structure

Hospital Management System
│
├── backend
│ ├── config
│ │ ├── db.js
│ │ └── mailer.js
│ ├── controllers
│ │ ├── appointmentController.js
│ │ └── patientController.js
│ ├── models
│ │ ├── Appointment.js
│ │ └── Patient.js
│ ├── routes
│ │ ├── appointmentRoutes.js
│ │ └── patientRoutes.js
│ ├── server.js
│ └── package.json
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
│
└── .gitignore


---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_id
EMAIL_PASS=your_gmail_app_password


