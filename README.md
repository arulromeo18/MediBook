MediBook – Hospital Appointment Booking System 🏥

🌐 Live Demo
https://medi-book-weld.vercel.app

A full stack web application that enables patients to book appointments with doctors efficiently, with complete management for hospitals, doctors, and appointments.

✨ Features
-🔐 JWT Authentication (Register/Login)
-👨‍⚕️ Doctor Management – Browse by specialization and hospital
-📅 Appointment Booking – Book, view, and manage appointments
-🗓️ Doctor Scheduling – Doctors can manage their availability
-🛠️ Admin Panel – Control over hospitals, doctors, and appointments
-🔍 Search Functionality – Search doctors and hospitals with suggestions

🛠️ Tech Stack
Frontend: React.js, HTML, CSS
Backend: Java, Spring Boot, REST APIs
Database: MongoDB
Auth: JWT Authentication

🚀 Setup
1. Clone the repository
git clone https://github.com/arulromeo18/medibook
2. Start the backend
cd hospitalsystem
./mvnw spring-boot:run
3. Start the frontend
cd hospital-frontend
npm install
npm start
Runs on http://localhost:3000

📁 Project Structure
medibook/
├── hospital-frontend/        # React frontend
│   ├── src/
│   └── public/
└── hospitalsystem/           # Spring Boot backend
    └── src/main/java/com/hospital/
        ├── controller/       # REST API controllers
        ├── service/          # Business logic
        ├── model/            # Data models
        ├── repository/       # MongoDB repositories
        └── security/         # JWT authentication

👨‍💻 Author
GitHub: https://github.com/arulromeo18
LinkedIn: https://linkedin.com/in/arulkumar-v-a9b406387
