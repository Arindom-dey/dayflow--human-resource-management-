import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Check, X, Filter, Plus, FileText, Calendar, Wallet } from 'lucide-react';

const LeaveManagement = () => {
    const { user } = useAuth();
    const { leaves, addLeaveRequest, updateLeaveStatus } = useData();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [leaveType, setLeaveType] = useState('Paid time Off');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allocation, setAllocation] = useState(1);
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addLeaveRequest({
            employeeId: user.id,
            employeeName: user.name,
            type: leaveType,
            startDate,
            endDate,
            reason
        });
        setShowForm(false);
        setReason('');
        setStartDate('');
        setEndDate('');
    };

    const isAdmin = user.role === 'admin';
    const displayedLeaves = isAdmin ? leaves : leaves.filter(l => l.employeeId === user.id);

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: '#262626', border: '1px solid #404040', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Wallet color="#60A5FA" size={24} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>24</span>
                    </div>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Paid time Off (Days Available)</span>
                </div>
                <div style={{ background: '#262626', border: '1px solid #404040', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Wallet color="#F87171" size={24} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>07</span>
                    </div>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Sick time Off (Days Available)</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Time Off Requests</h2>
                {!isAdmin && (
                    <button className="btn btn-primary" style={{ background: '#A855F7', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowForm(true)}>
                        <Plus size={18} /> NEW Request
                    </button>
                )}
            </div>

            {showForm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', background: '#1a1a1a', border: '1px solid #333', padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', color: 'white' }}>Time off Type Request</h3>
                            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ color: '#aaa' }}>Time off Type</label>
                                    <select className="input-field" value={leaveType} onChange={e => setLeaveType(e.target.value)} style={{ background: '#262626', border: '1px solid #444', color: 'white' }}>
                                        <option>Paid time Off</option>
                                        <option>Sick Leave</option>
                                        <option>Unpaid Leaves</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ color: '#aaa' }}>Validity Period</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ background: '#262626', border: '1px solid #444', color: 'white' }} />
                                        <span style={{ color: '#666' }}>To</span>
                                        <input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} required style={{ background: '#262626', border: '1px solid #444', color: 'white' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ color: '#aaa' }}>Allocation</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input type="number" className="input-field" value={allocation} onChange={e => setAllocation(e.target.value)} style={{ width: '80px', background: '#262626', border: '1px solid #444', color: 'white' }} />
                                        <span style={{ color: '#60A5FA' }}>Days</span>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'start' }}>
                                    <label style={{ color: '#aaa', paddingTop: '0.5rem' }}>Attachment</label>
                                    <div style={{ border: '1px dashed #444', padding: '1rem', borderRadius: '4px', textAlign: 'center', color: '#666', cursor: 'pointer' }}>
                                        Click to upload (For sick leave certificate)
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ background: '#A855F7', border: 'none' }}>Submit</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ background: '#333', color: 'white', border: 'none' }}>Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: '0', background: '#262626', border: '1px solid #404040' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: '#aaa', fontSize: '0.85rem', borderBottom: '1px solid #404040' }}>
                            {isAdmin && <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Employee</th>}
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Start Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>End Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Time off Type</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}></th>
                        </tr>
                    </thead>
                    <tbody style={{ color: 'white' }}>
                        {displayedLeaves.map(leave => (
                            <tr key={leave.id} style={{ borderBottom: '1px solid #333' }}>
                                {isAdmin && (
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{leave.employeeName}</td>
                                )}
                                <td style={{ padding: '1rem 1.5rem' }}>{leave.startDate}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{leave.endDate}</td>
                                <td style={{ padding: '1rem 1.5rem', color: '#60A5FA' }}>{leave.type}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        color: leave.status === 'Approved' ? '#10B981' : leave.status === 'Rejected' ? '#F87171' : '#F59E0B'
                                    }}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    {isAdmin && leave.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                                                style={{ padding: '0.25rem', background: '#10B981', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                                                title="Approve"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => updateLeaveStatus(leave.id, 'Rejected')}
                                                style={{ padding: '0.25rem', background: '#F87171', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveManagement;
