import React from 'react';
import { useData } from '../../context/DataContext';
import { Users, UserCheck, Calendar, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: `var(--${color}-bg)`,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={28} color={`var(--${color})`} />
        </div>
        <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { employees, leaves, attendance } = useData();

    // Stats
    const totalEmployees = employees.length;
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    // Mock Present today
    const presentToday = 12; // Just a mock number or calculate from attendance mock

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Total Employees"
                    value={totalEmployees}
                    icon={Users}
                    color="primary"
                />
                <StatCard
                    title="Present Today"
                    value={presentToday}
                    icon={UserCheck}
                    color="success"
                />
                <StatCard
                    title="Pending Leaves"
                    value={pendingLeaves}
                    icon={Calendar}
                    color="warning"
                />
                <StatCard
                    title="On Time %"
                    value="94%"
                    icon={Clock}
                    color="info"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Employee Overview</h3>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>View All</button>
                    </div>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Name</th>
                                <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Role</th>
                                <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Department</th>
                                <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.slice(0, 5).map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1rem 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                                                {emp.name.charAt(0)}
                                            </div>
                                            {emp.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 0', textTransform: 'capitalize' }}>{emp.role}</td>
                                    <td style={{ padding: '1rem 0' }}>{emp.department}</td>
                                    <td style={{ padding: '1rem 0' }}><span className="badge badge-success">Active</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Pending Requests</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {leaves.filter(l => l.status === 'Pending').slice(0, 3).map(leave => (
                            <div key={leave.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{leave.employeeName}</span>
                                    <span className="badge badge-warning">Pending</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {leave.type} • {leave.startDate}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Approve</button>
                                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Reject</button>
                                </div>
                            </div>
                        ))}
                        {leaves.filter(l => l.status === 'Pending').length === 0 && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No pending requests.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
