# NexHR - Human Resource Management System

A modern, comprehensive HRMS build for the hackathon, featuring role-based access for Admins and Employees.

## Features

### Authentication & Authorization
- **Secure Sign In**: Role-based login (Admin/Employee).
- **Session Management**: Persistent sessions using local storage.

### Dashboard
- **Employee Dashboard**: Quick access to attendance, leave balance, and recent activity.
- **Admin Dashboard**: Overview of total employees, attendance stats, and pending leave approvals.

### Core Modules
- **Employee Management**: 
  - Admin: View all employees, search, and manage profiles.
  - Employee: View and edit personal profile (limited fields).
- **Attendance Tracking**:
  - Daily check-in/check-out for employees.
  - Attendance history view for both roles.
- **Leave Management**:
  - Employees can apply for Paid, Sick, or Unpaid leave.
  - Admins can review, approve, or reject requests.
- **Payroll**:
  - Employees can view salary slips.
  - Admins have an overview of payroll status.

## Technology Stack
- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (Premium Custom Design System)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Login Credentials (Demo)**
   - **Admin**: `admin@hrms.com` / `admin123`
   - **Employee**: `emp@hrms.com` / `emp123`
   *(Login page includes clickable demo buttons for convenience)*

## Project Structure
- `src/components`: Reusable UI components (Sidebar, Header, Card...)
- `src/layouts`: Main layout wrapper
- `src/pages`: Feature-specific pages (Dashboard, Profile, Attendance...)
- `src/context`: Global state management (Auth, Mock Data)
