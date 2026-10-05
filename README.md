# 🌾 Smart Paddy Manager

A full-stack web-based **Paddy Field Management System** designed to help manage farmers, fields, crops, cultivation activities, agricultural inputs, field monitoring, expenses, harvesting, and reports in one centralized system.

## 🚀 Project Overview

**Smart Paddy Manager** is a full-stack application developed using **React, Node.js, Express.js, and MySQL**.

The system provides a centralized platform for managing important paddy farming information and monitoring field-related activities through a modern web interface.

## ✨ Implemented Features

### 🔐 Authentication

* Login interface
* Authentication middleware
* Protected backend functionality

### 📊 Dashboard

* Centralized dashboard
* Overview of important farming information
* Modern dashboard interface

### 👨‍🌾 Farmer Management

* Add farmers
* View farmers
* Edit farmer information
* Delete farmers
* Farmer information stored in MySQL

### 🌱 Field Management

* Add fields
* View fields
* Edit field information
* Delete fields
* Farmer selection
* Field area and location information
* Soil type and irrigation type
* Current crop and planting date

### 🌾 Crop Management

* Add crops
* View crops
* Edit crops
* Delete crops

### 🚜 Cultivation Management

* Add cultivation records
* View cultivation records
* Edit cultivation records
* Delete cultivation records
* MySQL database integration

### 🧪 Fertilizer & Pesticide Management

* Manage fertilizer and pesticide records
* Record agricultural input information
* Database-connected management functionality

### 📡 Field Monitoring

* Field monitoring interface
* Monitor field-related information through the system

### 💰 Expense Management

* Expense management interface
* Record and manage farming expenses

### 🌾 Harvest Management

* Harvest management interface
* Manage harvest-related information

### 📑 Reports

* Reports section for farming management information

## 🛠️ Technologies Used

### Frontend

* React
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Node.js
* Express.js
* MySQL
* mysql2
* CORS

### Development Tools

* Visual Studio Code
* XAMPP
* Git
* GitHub

## 📁 Project Structure


Smart-Paddy-Manager/
│
├── backend/
│   ├── middleware/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
└── README.md


## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/hashiniranasingha/Smart-Paddy-Manager.git
```

### 2. Open the project

```bash
cd Smart-Paddy-Manager
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Install backend dependencies

Open another terminal and run:

```bash
cd backend
npm install
```

### 5. Start MySQL

Start **MySQL** using XAMPP.

Make sure the database used by the application is available before starting the backend.

### 6. Start the backend

Inside the `backend` folder:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 7. Start the frontend

Inside the `frontend` folder:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🗄️ Database

The application uses **MySQL** for storing and managing application data.

The backend connects to the MySQL database through the database configuration in:

```text
backend/db.js
```

## 🎯 Project Purpose

The purpose of Smart Paddy Manager is to provide a centralized digital platform for managing paddy farming operations and related information through a user-friendly web application.

## 👩‍💻 Developer

**R.M.H.S. Ranasingha**

HNDIT — SLIATE Badulla ATI

## 📌 Repository

**GitHub:**
https://github.com/hashiniranasingha/Smart-Paddy-Manager
