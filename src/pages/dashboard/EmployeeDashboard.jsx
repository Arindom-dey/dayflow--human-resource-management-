import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { User, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, link, linkText }) => (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{value}</h3>
            </div>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: `var(--${color}-bg)`,
                color: `var(--${color})`, // This might need adjustment if using simplified vars
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={20} style={{ color: color === 'primary' ? 'var(--primary)' : undefined }} />
                {/* Simplified color logic */}
            </div>
        </div>
        {link && (
            <Link to={link} style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {linkText} &rarr;
            </Link>
        )}
    </div>
);

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const { attendance, leaves } = useData();

    // Calculate some stats (mock)
    const myLeaves = leaves.filter(l => l.employeeId === user.id);
    const pendingLeaves = myLeaves.filter(l => l.status === 'Pending').length;
    const todayAttendance = attendance.find(a => a.employeeId === user.id); // mock check
    const isCheckedIn = !!todayAttendance;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <StatCard
                        title="Attendance Status"
                        value={isCheckedIn ? "Checked In" : "Not Checked In"}
                        icon={Clock}
                        color="success"
                        link="/attendance"
                        linkText="View Logs"
                    />
                    <StatCard
                        title="Leave Balance"
                        value="12 Days"
                        icon={Calendar}
                        color="info"
                        link="/leaves"
                        linkText="Request Leave"
                    />
                    <StatCard
                        title="Pending Requests"
                        value={pendingLeaves}
                        icon={AlertCircle}
                        color="warning"
                        link="/leaves"
                        linkText="View Status"
                    />
                    <StatCard
                        title="Profile Completion"
                        value="90%"
                        icon={User}
                        color="primary"
                        link="/profile"
                        linkText="Edit Profile"
                    />
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '0.5rem' }}></div>
                        <div>
                            <p style={{ fontWeight: 500 }}>Logged in successfully</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Today at 09:00 AM</p>
                        </div>
                    </div>
                    {/* Mock activities */}
                    <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--info)', marginTop: '0.5rem' }}></div>
                        <div>
                            <p style={{ fontWeight: 500 }}>Leave request submitted</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Yesterday at 4:30 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
