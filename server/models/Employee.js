
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'employee' // 'admin' or 'employee'
    },
    jobTitle: {
        type: DataTypes.STRING
    },
    department: {
        type: DataTypes.STRING
    },
    companyName: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    joinDate: {
        type: DataTypes.DATEONLY
    },
    address: {
        type: DataTypes.STRING
    },
    salary: {
        type: DataTypes.INTEGER
    },
    avatar: {
        type: DataTypes.STRING
    }
});

export default Employee;
