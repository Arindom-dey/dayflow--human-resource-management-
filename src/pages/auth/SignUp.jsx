import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const SignUp = () => {
    const navigate = useNavigate();
    const { addEmployee } = useData();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State for form data
    const [formData, setFormData] = useState({
        companyName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });


    const generateCombinedId = () => {
        // 1. Company Initials
        const companyStr = formData.companyName.trim().toUpperCase() || 'XX';
        const getInitials = (str) => {
            const parts = str.split(' ').filter(p => p.length > 0);
            if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            } else if (parts.length === 1) {
                return parts[0].slice(0, 2).toUpperCase();
            }
            return 'XX';
        };
        const companyCode = getInitials(companyStr);

        // 2. Name Code (First 2 letters of First Name + First 2 letters of Last Name)
        const nameStr = formData.name.trim().toUpperCase() || 'USER';
        let nameCode = 'XXXX';
        const nameParts = nameStr.split(' ').filter(p => p.length > 0);

        if (nameParts.length >= 2) {
            const first = nameParts[0].slice(0, 2).padEnd(2, 'X');
            const last = nameParts[1].slice(0, 2).padEnd(2, 'X');
            nameCode = first + last;
        } else if (nameParts.length === 1) {
            nameCode = nameParts[0].slice(0, 2).padEnd(2, 'X').padEnd(4, 'X');
        }

        // 3. Year
        const year = new Date().getFullYear();

        // 4. Serial (0001 for HR Admin signups)
        const serial = '0001';

        return `${companyCode}${nameCode}${year}${serial}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Auto Generate ID Logic
        const newAdminId = generateCombinedId();

        const newAdmin = {
            id: newAdminId,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'admin',
            jobTitle: 'HR Administrator',
            department: 'Human Resources',
            companyName: formData.companyName,
            phone: formData.phone,
            joinDate: new Date().toISOString().split('T')[0],
            address: 'Headquarters',
            avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=random`
        };


        addEmployee(newAdmin);

        alert(`Registration Successful!\nYour ID is: ${newAdminId}\nPlease Log In with this ID or your Email.`);
        navigate('/login');
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, white 100%)',
            padding: '2rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', background: '#262626', color: 'white', border: '1px solid #404040' }}>

                {/* App/Web Logo Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        background: '#1a1a1a',
                        padding: '1rem',
                        borderRadius: '8px',
                        display: 'inline-block',
                        minWidth: '200px'
                    }}>
                        <h1 style={{ fontSize: '1.2rem', margin: 0, color: '#aaa', fontWeight: 'normal' }}>App/Web Logo</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Company Name with Upload Icon */}
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 40px', alignItems: 'center' }}>
                        <label style={{ color: '#ccc' }}>Company Name :-</label>
                        <input
                            required
                            type="text"
                            style={inputStyle}
                            value={formData.companyName}
                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        />
                        <label style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', color: '#3B82F6' }} title="Upload Logo">
                            <Upload size={20} />
                            <input type="file" style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Name */}
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', paddingRight: '40px' }}>
                        <label style={{ color: '#ccc' }}>Name :-</label>
                        <input
                            required
                            type="text"
                            style={inputStyle}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', paddingRight: '40px' }}>
                        <label style={{ color: '#ccc' }}>Email :-</label>
                        <input
                            required
                            type="email"
                            style={inputStyle}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Phone */}
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', paddingRight: '40px' }}>
                        <label style={{ color: '#ccc' }}>Phone :-</label>
                        <input
                            required
                            type="tel"
                            style={inputStyle}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', paddingRight: '40px' }}>
                        <label style={{ color: '#ccc' }}>Password :-</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                style={{ ...inputStyle, width: '100%' }}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', paddingRight: '40px' }}>
                        <label style={{ color: '#ccc' }}>Confirm Password :-</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                style={{ ...inputStyle, width: '100%' }}
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeButtonStyle}>
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" style={btnStyle}>
                        Sign Up
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#aaa' }}>Already have an account? </span>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Sign In</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

const btnStyle = {
    width: '100%',
    padding: '0.75rem',
    marginTop: '1rem',
    background: '#A855F7',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
};

const inputStyle = {
    background: 'transparent',
    borderBottom: '1px solid #666',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    color: 'white',
    padding: '0.5rem 0',
    outline: 'none',
    width: '100%'
};

const eyeButtonStyle = {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer'
};

export default SignUp;
