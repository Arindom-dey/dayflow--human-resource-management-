import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { Clock, MapPin, CalendarDays } from 'lucide-react';

const AttendanceView = () => {
    const { user } = useAuth();
    const { attendance, markAttendance, updateAttendance } = useData();
    const isAdmin = user.role === 'admin';

    // Simulate current time state
    const [currentTime, setCurrentTime] = useState(new Date());

    const today = format(new Date(), 'yyyy-MM-dd');
    // Find the CURRENT active session (where checkOut is '-') - SYNCED WITH NAVBAR LOGIC
    const activeSession = attendance.find(a => a.employeeId === user.id && a.date === today && a.checkOut === '-');
    const isCheckedIn = !!activeSession;

    const handleCheckInOut = () => {
        if (isCheckedIn) {
            // Check Out Logic (Update existing active session)
            if (window.confirm("Are you sure you want to Check Out?")) {
                const updatedRecord = {
                    ...activeSession,
                    checkOut: format(new Date(), 'hh:mm a')
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
                checkIn: format(new Date(), 'hh:mm a'),
                checkOut: '-'
            });
        }
    };

    // Calculate elapsed time and remaining time
    const SHIFT_DURATION_HOURS = 9;
    let elapsedTimeStr = '00 hrs 00 mins';
    let remainingTimeStr = `${SHIFT_DURATION_HOURS} hrs 00 mins`;
    let progressPercentage = 0;

    if (isCheckedIn && activeSession?.checkIn) {
        // Parse Check In Time (e.g., "09:00 AM")
        const [timePart, modifier] = activeSession.checkIn.split(' ');
        let [hours, minutes] = timePart.split(':');

        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;

        const checkInDate = new Date();
        checkInDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

        // Elapsed in milliseconds
        const diffMs = currentTime - checkInDate;
        if (diffMs > 0) {
            const elapsedHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const elapsedMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            elapsedTimeStr = `${elapsedHrs} hrs ${elapsedMins} mins`;

            // Remaining
            const totalShiftMs = SHIFT_DURATION_HOURS * 60 * 60 * 1000;
            const remainingMs = Math.max(0, totalShiftMs - diffMs);
            const remainingHrs = Math.floor(remainingMs / (1000 * 60 * 60));
            const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
            remainingTimeStr = `${remainingHrs} hrs ${remainingMins} mins`;

            // Progress for circle
            progressPercentage = Math.min(100, (diffMs / totalShiftMs) * 100);
        }
    }

    const displayedAttendance = isAdmin ? attendance : attendance.filter(a => a.employeeId === user.id);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Attendance & Time Tracking</h2>
                {!isAdmin && (
                    <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--primary)', color: 'white', border: 'none' }}>
                        <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{format(currentTime, 'EEEE, d MMMM')}</span>
                        <div style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{format(currentTime, 'HH:mm')}</span>
                        </div>
                    </div>
                )}
            </div>

            {!isAdmin && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '250px' }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            background: `conic-gradient(var(--success) ${progressPercentage * 3.6}deg, #333 0deg)`
                        }}>
                            {/* Inner circle mask */}
                            <div style={{
                                position: 'absolute',
                                top: '10px', left: '10px', right: '10px', bottom: '10px',
                                background: '#262626',
                                borderRadius: '50%',
                                zIndex: 1
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Clock size={32} color={isCheckedIn ? 'var(--success)' : 'var(--text-light)'} style={{ marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                                    {isCheckedIn ? elapsedTimeStr : '00:00:00'}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                    Elapsed Time
                                </span>
                                {isCheckedIn && (
                                    <span style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                                        {remainingTimeStr} Left
                                    </span>
                                )}
                            </div>
                        </div>

                        {!isCheckedIn ? (
                            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: '30px' }} onClick={handleCheckInOut}>
                                Check In Now
                            </button>
                        ) : (
                            <button className="btn btn-danger" style={{ padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: '30px' }} onClick={handleCheckInOut}>
                                Check Out
                            </button>
                        )}

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> Remote Office</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CalendarDays size={14} /> Regular Shift</span>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Today's Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Check In</span>
                                <span style={{ fontWeight: 600 }}>{activeSession?.checkIn || '--:--'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Check Out</span>
                                <span style={{ fontWeight: 600 }}>--</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Total Hrs</span>
                                <span style={{ fontWeight: 600 }}>-- hrs</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Attendance History</h3>
                </div>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-body)' }}>
                        <tr style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {isAdmin && <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Employee ID</th>}
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Check In</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Check Out</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedAttendance.map((record) => (
                            <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                {isAdmin && <td style={{ padding: '1rem 1.5rem' }}>{record.employeeId}</td>}
                                <td style={{ padding: '1rem 1.5rem' }}>{record.date}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{record.checkIn}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{record.checkOut}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className={`badge badge-${record.status === 'Present' ? 'success' :
                                        record.status === 'Absent' ? 'danger' : 'warning'
                                        }`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceView;
