import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    User,
    Users,
    CalendarCheck,
    Clock,
    Banknote,
    LogOut,
    Briefcase
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'employee'] },
        { label: 'My Profile', path: '/profile', icon: User, roles: ['employee'] },
        { label: 'Employees', path: '/employees', icon: Users, roles: ['admin'] },
        { label: 'Attendance', path: '/attendance', icon: Clock, roles: ['admin', 'employee'] },
        { label: 'Leave Requests', path: '/leaves', icon: CalendarCheck, roles: ['admin', 'employee'] },
        { label: 'Payroll', path: '/payroll', icon: Banknote, roles: ['admin', 'employee'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className="sidebar">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Briefcase size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: 1 }}>DayFlow</h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>HR Management</span>
                </div>
            </div>

            <nav style={{ padding: '1.5rem', flex: 1 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filteredNavItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    background: isActive ? 'var(--primary-light)' : 'transparent',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all 0.2s'
                                })}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}
                    className="hover:bg-red-50"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
