
import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// Get All Employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Employee by ID or Email
// Note: This matches our "FoundUser" login logic
router.post('/login-check', async (req, res) => {
    const { loginId, password } = req.body;
    try {
        // Find by Email OR ID
        // In Sequelize, Op.or
        const { Op } = await import('sequelize');

        const employee = await Employee.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { email: loginId },
                            { id: loginId }
                        ]
                    },
                    { password: password }
                ]
            }
        });

        if (employee) {
            res.json({ success: true, user: employee });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Employee
router.post('/', async (req, res) => {
    try {
        const newEmployee = await Employee.create(req.body);
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
