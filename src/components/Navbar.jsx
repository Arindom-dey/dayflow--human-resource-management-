import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { attendance, markAttendance, updateAttendance } = useData();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);

    // Check In/Out Logic (Simplified from Sidebar/Header)
    const today = new Date().toISOString().split('T')[0];
    // Find the CURRENT active session (where checkOut is '-')
    const activeSession = attendance.find(a => a.employeeId === user?.id && a.date === today && a.checkOut === '-');
    const isCheckedIn = !!activeSession;
    const isCheckedOut = !isCheckedIn && attendance.some(a => a.employeeId === user?.id && a.date === today && a.checkOut !== '-'); // Check if any session for today is completed

    const handleCheckInOut = () => {
        if (isCheckedIn) {
            // Check Out Logic
            if (window.confirm("Are you sure you want to Check Out?")) {
                const updatedRecord = {
                    ...activeSession,
                    checkOut: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                };
                updateAttendance(updatedRecord);
            }
        } else {
            // Check In Logic (Start new session)
            markAttendance({
                id: Date.now(),
                employeeId: user.id,
                employeeName: user.name,
                date: today,
                status: 'Present',
                checkIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                checkOut: '-'
            });
        }
    };

    const navLinks = [
        { name: 'Employees', path: '/employees', roles: ['admin', 'employee'] },
        { name: 'Attendance', path: '/attendance', roles: ['admin', 'employee'] },
        { name: 'Time Off', path: '/leaves', roles: ['admin', 'employee'] },
    ];

    const handleLogout = () => {
        if (window.confirm("Sure you want to log out??")) {
            logout();
            navigate('/login');
        }
    }

    return (
        <nav style={{ background: '#242424', color: 'white', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Dayflow</span>
                </div>

                <div className="desktop-nav" style={{ display: 'flex', gap: '1.5rem' }}>
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            style={({ isActive }) => ({
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                textDecoration: 'none',
                                fontWeight: 500,
                                borderBottom: isActive ? '2px solid #F87171' : '2px solid transparent', // Red accent from image
                                paddingBottom: '19px',
                                paddingTop: '21px'
                            })}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* Check In Widget */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: isCheckedIn ? '#10B981' : '#EF4444',
                            boxShadow: '0 0 8px rgba(0,0,0,0.5)'
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <button onClick={handleCheckInOut} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            {isCheckedIn ? 'Check Out ->' : 'Check In ->'}
                        </button>

                        {isCheckedIn && (
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px', marginLeft: '2px' }}>
                                Since {activeSession.checkIn}
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <img
                            src={user?.avatar || 'https://ui-avatars.com/api/?background=random'}
                            alt="Profile"
                            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }}
                        />
                    </button>

                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '50px',
                            right: 0,
                            background: '#333',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            width: '180px',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0.5rem',
                            zIndex: 100
                        }}>
                            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.5rem' }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{user?.role}</p>
                            </div>
                            <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={16} /> My Profile
                            </button>
                            <button onClick={handleLogout} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#F87171', padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LogOut size={16} /> Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
