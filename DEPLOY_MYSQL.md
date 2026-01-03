
# 🚀 Deployment Guide: Running DayFlow with MySQL

Follow these steps to get your full stack application running with a real MySQL database.

## Step 1: Install MySQL Server
If you haven't already, you need to install MySQL on your computer.
- **Windows**: Download and install [MySQL Installer](https://dev.mysql.com/downloads/installer/). Select "Server only" or "Developer Default".
- **Remember your Root Password**: During installation, you will set a password for the `root` user. Write this down!

## Step 2: Create the Database
1. Open **MySQL Workbench** or your **Command Line**.
2. Run the following SQL command to create the database:
   ```sql
   CREATE DATABASE hrms_db;
   ```

## Step 3: Configure Credentials (.env)
1. Open the file `e:/agent manager/.env` in your editor.
2. Update it with your MySQL password and email credentials:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=YOUR_MYSQL_PASSWORD_HERE  <-- REPLACE THIS with your actual password
   DB_NAME=hrms_db

   # Email Configuration (for OTPs)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

## Step 4: Install Dependencies
Open a terminal in `e:/agent manager` and run:
```bash
npm install
```

## Step 5: Start the Backend Server
This server handles the database and email logic.
1. Open a **New Terminal**.
2. Run:
   ```bash
   node server/index.js
   ```
3. You should see:
   > Backend Server running on http://localhost:3001
   > Database synced successfully.

## Step 6: Start the Frontend Website
1. Open another **New Terminal**.
2. Run:
   ```bash
   npm run dev
   ```
3. Open the link shown (e.g., http://localhost:5173).

## 🎉 Done!
Your application is now using a real MySQL database. Any employee you add or edit will be saved permanently to your database.
