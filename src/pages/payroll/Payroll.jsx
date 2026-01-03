import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Download } from 'lucide-react';

const Payroll = () => {
    const { user } = useAuth();
    const { employees } = useData();
    const isAdmin = user.role === 'admin';

    // Mock Payroll Months
    const months = ['October 2023', 'November 2023', 'December 2023'];

    if (isAdmin) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Payroll Management</h2>
                    <button className="btn btn-primary">Process Payroll</button>
                </div>
                <div className="card" style={{ padding: '0' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-body)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Employee</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Role</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Base Salary</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Allowances</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Deductions</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Net Salary</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{emp.name}</td>
                                    <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{emp.role}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>${(emp.salary || 0).toLocaleString()}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--success)' }}>+$2,000</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--danger)' }}>-$500</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>${((emp.salary || 0) / 12 + 1500).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}><span className="badge badge-success">Paid</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Employee View
    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>My Salary Slips</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {months.map((month, index) => (
                    <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                $
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{month}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Processed on {month.split(' ')[0]} 28, {month.split(' ')[1]}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Net Pay</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>$6,500.00</p>
                            </div>
                            <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Payroll;
