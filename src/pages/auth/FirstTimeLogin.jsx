import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Lock, Mail, User } from 'lucide-react';

const FirstTimeLogin = () => {
    const { employees } = useData();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeId: '',
        email: '',
        tempPassword: ''
    });
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Triple-Check Logic
        const user = employees.find(emp =>
            emp.id === formData.employeeId &&
            emp.email === formData.email &&
            emp.password === formData.tempPassword
        );

        if (user) {
            // Success: Redirect to Change Password with user ID in state
            navigate('/change-password', { state: { userId: user.id } });
        } else {
            // Failed: Red Alert
            setError(true);
        }
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
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>First Time Login</h1>
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Verify your identity to activate your account</p>
                </div>

                {error && (
                    <div className="animate-fade-in" style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #EF4444',
                        color: '#EF4444',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                    }}>
                        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Authentication Failed</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                                Details do not match our records. Please check your Employee ID, Email, and Temporary Password.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: error ? '1px solid #EF4444' : '1px solid #555', borderRadius: '4px', padding: '0.75rem' }}>
                        <User size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                        <input
                            placeholder="Employee ID (e.g., OIJODO20260001)"
                            value={formData.employeeId}
                            onChange={e => { setFormData({ ...formData, employeeId: e.target.value }); setError(false); }}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: error ? '1px solid #EF4444' : '1px solid #555', borderRadius: '4px', padding: '0.75rem' }}>
                        <Mail size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => { setFormData({ ...formData, email: e.target.value }); setError(false); }}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            required
                        />
                    </div>

                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: error ? '1px solid #EF4444' : '1px solid #555', borderRadius: '4px', padding: '0.75rem' }}>
                        <Lock size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                        <input
                            type="password"
                            placeholder="Temporary Password"
                            value={formData.tempPassword}
                            onChange={e => { setFormData({ ...formData, tempPassword: e.target.value }); setError(false); }}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', background: '#A855F7', border: 'none', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        Verify & Continue <ArrowRight size={18} />
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FirstTimeLogin;
