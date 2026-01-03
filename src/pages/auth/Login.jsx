import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { employees } = useData();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password, employees);
            navigate('/');
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = (role) => {
        if (role === 'admin') {
            setEmail('admin@hrms.com');
            setPassword('admin123');
        } else {
            setEmail('emp@hrms.com');
            setPassword('emp123');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, white 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>NexHR</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{
                        background: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="label" style={{ color: '#aaa', marginBottom: '0.5rem', display: 'block' }}>Login Id/Email :-</label>
                        <input
                            type="text"
                            className="input-field"
                            // placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                background: 'transparent',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                color: 'white',
                                padding: '0.75rem',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label className="label" style={{ color: '#aaa', marginBottom: '0.5rem', display: 'block' }}>Password :-</label>
                        <input
                            type="password"
                            className="input-field"
                            // placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                background: 'transparent',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                color: 'white',
                                padding: '0.75rem',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            background: '#A855F7', /* Purple from ID card / wireframe */
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Don't have an Account? </span>
                        <Link to="/signup" style={{ color: '#fff', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'none' }}>Sign Up</Link>
                    </div>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                        Demo Credentials (Click to fill)
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" className="btn" style={{ flex: 1, fontSize: '0.8rem', background: '#333', color: 'white', border: '1px solid #555', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDemoLogin('admin')}>
                            Admin
                        </button>
                        <button type="button" className="btn" style={{ flex: 1, fontSize: '0.8rem', background: '#333', color: 'white', border: '1px solid #555', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDemoLogin('employee')}>
                            Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
