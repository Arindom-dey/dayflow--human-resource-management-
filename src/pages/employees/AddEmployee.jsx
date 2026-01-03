import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Mail, Phone, Lock, Upload } from 'lucide-react';

const AddEmployee = () => {
    const { addEmployee, employees } = useData();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: 'Odoo India',
        joiningYear: new Date().getFullYear(),
        email: '',
        phone: '',
        department: '',
        jobTitle: '',
    });

    const [generatedId, setGeneratedId] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');

    // Automatically generate ID whenever relevant fields change
    React.useEffect(() => {
        const { firstName, lastName, joiningYear } = formData;

        if (firstName && lastName) {
            // Logic: [OI] [First 2 First] [First 2 Last] [Year] [Serial]
            const companyCode = 'OI'; // Hardcoded for Odoo India
            const firstCode = firstName.slice(0, 2).toUpperCase();
            const lastCode = lastName.slice(0, 2).toUpperCase();
            const serial = (employees.length + 1).toString().padStart(4, '0');

            setGeneratedId(`${companyCode}${firstCode}${lastCode}${joiningYear}${serial}`);
        } else {
            setGeneratedId('');
        }
    }, [formData.firstName, formData.lastName, formData.joiningYear, employees.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Auto-generate password
        const password = Math.random().toString(36).slice(-8);
        setGeneratedPassword(password);

        setTimeout(() => {
            addEmployee({
                id: generatedId,
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                department: formData.department,
                jobTitle: formData.jobTitle,
                role: 'employee', // Default role
                joinDate: new Date().toISOString().split('T')[0],
                password: password, // In a real app, this would be hashed on backend
                avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`
            });
            alert(`Employee Created!\nID: ${generatedId}\nPassword: ${password}`);
            navigate('/employees');
        }, 500);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', color: '#e5e5e5' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center' }}>Add New Employee</h1>

            <div className="card" style={{ background: '#262626', border: '1px solid #404040', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #666' }}>
                        <Upload size={24} color="#666" />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#888' }}>Upload Profile Picture</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="label">First Name</label>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.5rem' }}>
                                <User size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Jane"
                                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Last Name</label>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.5rem' }}>
                                <User size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Doe"
                                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="label">System Generated ID</label>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', padding: '0.75rem' }}>
                                <Lock size={18} color="#666" style={{ marginRight: '0.5rem' }} />
                                <input
                                    value={generatedId}
                                    readOnly
                                    placeholder="Auto-generated ID"
                                    style={{ background: 'transparent', border: 'none', color: '#A855F7', width: '100%', outline: 'none', fontWeight: 'bold' }}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>Format: [Company][First][Last][Year][Serial]</p>
                        </div>
                        <div>
                            <label className="label">Joining Year</label>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.75rem' }}>
                                <Briefcase size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                                <input
                                    type="number"
                                    name="joiningYear"
                                    value={formData.joiningYear}
                                    onChange={handleChange}
                                    min="2000"
                                    max="2100"
                                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="label">Email Address</label>
                        <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.5rem' }}>
                            <Mail size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="jane@hrms.com"
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Phone Number</label>
                        <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.5rem' }}>
                            <Phone size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 234 567 890"
                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="label">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                required
                                style={{ background: '#333', border: '1px solid #555', color: 'white', width: '100%', padding: '0.5rem', borderRadius: '4px', outline: 'none' }}
                            >
                                <option value="">Select Dept</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="HR">HR</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Job Title</label>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#333', border: '1px solid #555', borderRadius: '4px', padding: '0.5rem' }}>
                                <Briefcase size={18} color="#888" style={{ marginRight: '0.5rem' }} />
                                <input
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                    required
                                    placeholder="e.g. Designer"
                                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', background: '#A855F7', border: 'none', fontSize: '1rem' }}>
                        Create Employee
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
