import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Plane, Circle } from 'lucide-react';

const EmployeeList = () => {
    const { employees, attendance, leaves } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const getStatus = (empId) => {
        // Mock Status Logic based on data
        // 1. Check Leave
        const onLeave = leaves.find(l => l.employeeId === empId && l.startDate <= today && l.endDate >= today && l.status === 'Approved');
        if (onLeave) return { icon: Plane, color: '#60A5FA', label: 'On Leave' }; // Blue/Airplane

        // 2. Check Attendance
        // Is present only if checkOut is '-'
        const isPresent = attendance.find(a => a.employeeId === empId && a.date === today && a.checkOut === '-');
        if (isPresent) return { icon: Circle, color: '#10B981', label: 'Present' }; // Green

        // 3. Default Absent
        return { icon: Circle, color: '#F59E0B', label: 'Absent' }; // Yellow
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#333', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #444' }}>
                    <Search size={18} color="#aaa" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', minWidth: '250px' }}
                    />
                </div>
                <Link to="/employees/new" className="btn btn-primary" style={{ background: '#A855F7', border: 'none', textDecoration: 'none' }}>
                    NEW
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {filteredEmployees.map(emp => {
                    const status = getStatus(emp.id);
                    const StatusIcon = status.icon;

                    return (
                        <div className="flip-card" key={emp.id} style={{ height: '320px' }}>
                            <div className="flip-card-inner">
                                {/* FRONT SIDE */}
                                <div className="flip-card-front">
                                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                        <StatusIcon size={16} fill={status.color} color={status.color} />
                                    </div>

                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        marginBottom: '1rem',
                                        border: '2px solid rgba(168, 85, 247, 0.5)',
                                        boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)'
                                    }}>
                                        <img src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.name}&background=random`} alt={emp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{emp.name}</h3>
                                    <span style={{ fontSize: '0.85rem', color: '#A855F7', border: '1px solid #A855F7', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {emp.role}
                                    </span>
                                </div>

                                {/* BACK SIDE (Details) */}
                                <div className="flip-card-back">
                                    <h4 style={{ color: '#10B981', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '1.1rem' }}>Identified Personnel</h4>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', textAlign: 'left', fontSize: '0.9rem', color: '#ccc' }}>
                                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                            <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Department</span>
                                            {emp.department}
                                        </div>
                                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                            <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Email</span>
                                            {emp.email}
                                        </div>
                                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                            <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Phone</span>
                                            {emp.phone || 'N/A'}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/employees/${emp.id}`}
                                        style={{
                                            marginTop: 'auto',
                                            background: '#A855F7',
                                            color: 'white',
                                            textDecoration: 'none',
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        VIEW PROFILE
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmployeeList;
