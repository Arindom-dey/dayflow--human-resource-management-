import React, { createContext, useContext, useState } from 'react';
import { subDays, format } from 'date-fns';
import { API_BASE_URL } from '../config';

const DataContext = createContext();

export const useData = () => useContext(DataContext);


const INITIAL_EMPLOYEES = [
    { id: 'EMP001', name: 'John Doe', email: 'emp@hrms.com', password: 'tempPassword123', role: 'employee', jobTitle: 'Software Engineer', department: 'Engineering', salary: 85000, joinDate: '2023-01-15', phone: '123-456-7890', address: '123 Tech St, Silicon Valley' },
    { id: 'EMP002', name: 'Jane Smith', email: 'jane@hrms.com', password: 'tempPassword123', role: 'employee', jobTitle: 'Product Designer', department: 'Design', salary: 78000, joinDate: '2023-03-10', phone: '987-654-3210', address: '456 Creative Ave, New York' },
    { id: 'EMP003', name: 'Mike Johnson', email: 'mike@hrms.com', password: 'tempPassword123', role: 'employee', jobTitle: 'QA Engineer', department: 'Engineering', salary: 72000, joinDate: '2023-06-20', phone: '555-123-4567', address: '789 Bug Free Ln, Austin' },


    // HR / Admin Users - Add your HR credentials below to allow them to Sign Up / Log In
    // IMPORTANT: MANAGERS/AUTHORITY ADD HR DETAILS HERE MANUALLY FOR 1ST LOGIN
    {
        id: 'HR001',
        name: 'Emily Blunt',
        email: 'hr@hrms.com',
        password: 'temporaryHR123', // Initial Password given offline
        role: 'admin',
        companyName: 'NexHR Corp', // Verification Field
        phone: '111-222-3333',     // Verification Field
        jobTitle: 'HR Manager',
        department: 'Human Resources',
        salary: 80000,
        joinDate: '2023-01-01',
        address: 'HR Dept, Main Floor'
    },

    // Example: Pre-approved HR user for Sign Up testing
    {
        id: 'HR999',
        name: 'Super Admin',
        email: 'admin@hrms.com',
        password: 'admin123',
        role: 'admin',
        companyName: 'Odoo India',
        phone: '000-000-0000',
        jobTitle: 'System Admin',
        department: 'IT',
        salary: 120000,
        joinDate: '2022-01-01',
        address: 'Server Room'
    }
];

const INITIAL_LEAVES = [
    { id: 1, employeeId: 'EMP001', employeeName: 'John Doe', type: 'Sick Leave', startDate: '2023-11-10', endDate: '2023-11-12', status: 'Approved', reason: 'Flu' },
    { id: 2, employeeId: 'EMP002', employeeName: 'Jane Smith', type: 'Paid Leave', startDate: '2023-12-20', endDate: '2023-12-25', status: 'Pending', reason: 'Christmas Break' },
    { id: 3, employeeId: 'EMP001', employeeName: 'John Doe', type: 'Casual Leave', startDate: '2024-01-05', endDate: '2024-01-05', status: 'Rejected', reason: 'Personal work' }
];

const INITIAL_ATTENDANCE = [
    { id: 1, employeeId: 'EMP001', date: format(new Date(), 'yyyy-MM-dd'), status: 'Present', checkIn: '09:00 AM', checkOut: '05:00 PM' },
    { id: 2, employeeId: 'EMP001', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), status: 'Present', checkIn: '09:15 AM', checkOut: '05:10 PM' },
    { id: 3, employeeId: 'EMP001', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), status: 'Half-day', checkIn: '09:00 AM', checkOut: '01:00 PM' },
    { id: 4, employeeId: 'EMP002', date: format(new Date(), 'yyyy-MM-dd'), status: 'Absent', checkIn: '-', checkOut: '-' },
];

export const DataProvider = ({ children }) => {
    // Initialize employees
    const [employees, setEmployees] = useState([]);

    // Fetch employees from Database
    React.useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/employees`);
                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data);
                }
            } catch (err) {
                console.error("Failed to connect to backend", err);
            }
        };
        fetchEmployees();
    }, []);

    const [leaves, setLeaves] = useState(() => {
        const saved = localStorage.getItem('hrms_leaves');
        return saved ? JSON.parse(saved) : INITIAL_LEAVES;
    });

    const [attendance, setAttendance] = useState(() => {
        const saved = localStorage.getItem('hrms_attendance');
        return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    });

    // We no longer sync employees to localStorage as we use the DB
    /* 
    React.useEffect(() => {
        localStorage.setItem('hrms_employees', JSON.stringify(employees));
    }, [employees]);
    */

    React.useEffect(() => {
        localStorage.setItem('hrms_leaves', JSON.stringify(leaves));
    }, [leaves]);

    React.useEffect(() => {
        localStorage.setItem('hrms_attendance', JSON.stringify(attendance));
    }, [attendance]);


    const addLeaveRequest = (request) => {
        const newLeave = { ...request, id: leaves.length + 1, status: 'Pending' };
        setLeaves([newLeave, ...leaves]);
    };

    const updateLeaveStatus = (id, status) => {
        setLeaves(leaves.map(leave => leave.id === id ? { ...leave, status } : leave));
    };

    const markAttendance = (record) => {
        setAttendance([record, ...attendance]);
    };

    const updateEmployee = async (updatedEmp) => {
        // Optimistic UI Update
        setEmployees(employees.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));

        // Backend Update (TODO: Implement Update Endpoint in Backend)
        // await fetch(`http://localhost:3001/api/employees/${updatedEmp.id}`, { method: 'PUT', ... });
    }

    const addEmployee = async (newEmp) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmp)
            });
            const data = await response.json();
            if (data.success) {
                setEmployees([...employees, data.employee]);
            }
        } catch (err) {
            console.error("Failed to add employee to DB", err);
            // Fallback local add
            setEmployees([...employees, newEmp]);
        }
    };

    const updateAttendance = (record) => {
        setAttendance(attendance.map(att => att.id === record.id ? record : att));
    };

    return (
        <DataContext.Provider value={{
            employees,
            leaves,
            attendance,
            addLeaveRequest,
            updateLeaveStatus,
            markAttendance,
            updateAttendance,
            updateEmployee,
            addEmployee
        }}>
            {children}
        </DataContext.Provider>
    );
};
