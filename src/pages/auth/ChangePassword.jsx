import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Lock } from 'lucide-react';

const ChangePassword = () => {
    const { employees, updateEmployee } = useData();
    const { setAuthenticatedUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Ensure we have a valid user context passed from the verification step
    const userId = location.state?.userId;
    const user = employees.find(e => e.id === userId);

    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [error, setError] = useState('');

    if (!user) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', color: 'white' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Access Denied</h2>
                    <p style={{ color: '#aaa', margin: '1rem 0' }}>Invalid session. Please verify your identity first.</p>
                    <button onClick={() => navigate('/activate')} className="btn btn-primary">Go to Verification</button>
                </div>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwords.new.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setError('Passwords do not match');
            return;
        }

        // Logic: 
        // 1. Update user password in DB (One-Time Use logic: The temp password is effectively overwritten here)
        // 2. Log them in directly using the new password (or just authorize them)

        const updatedUser = { ...user, password: passwords.new, isTempPassword: false }; // Assuming we track temp status if we had backend
        updateEmployee(updatedUser);

        // Auto-login
        setAuthenticatedUser(updatedUser);

        alert('Password changed successfully! Redirecting to Dashboard...');
        navigate('/');
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#1a1a1a',
            color: 'white'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', background: '#262626', border: '1px solid #404040' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <CheckCircle size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Set New Password</h1>
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Secure your account to proceed</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#aaa' }}>New Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.75rem' }}>
                            <Lock size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="password"
                                placeholder="Min 6 characters"
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Confirm Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.75rem' }}>
                            <Lock size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', background: '#10B981', border: 'none', marginTop: '0.5rem', fontWeight: 600 }}>
                        Update Password & Login
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
