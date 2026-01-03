import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useParams } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, FileText, CreditCard } from 'lucide-react';

const EditableField = ({ label, value, field, type = "text", isEditing, formData, setFormData }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center' }}>
        <label style={{ color: '#aaa' }}>{label}</label>
        {isEditing ? (
            <input
                type={type}
                value={formData[field]}
                onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                onBlur={() => { /* Optional: Validate or Auto-save on blur */ }}
                autoFocus={false} // Prevent auto focus stealing if not intended
                style={{ background: '#333', border: '1px solid #555', color: 'white', padding: '0.5rem', borderRadius: '4px', width: '100%' }}
            />
        ) : (
            <div style={{ color: 'white' }}>{value || '-'}</div>
        )}
    </div>
);

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(id)}
        style={{
            background: activeTab === id ? '#404040' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === id ? '#666' : 'transparent',
            borderBottom: 'none',
            color: activeTab === id ? 'white' : '#aaa',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500,
            marginBottom: '-1px',
            zIndex: activeTab === id ? 1 : 0
        }}
    >
        {Icon && <Icon size={16} />}
        {label}
    </button>
);

const Profile = () => {
    const { user } = useAuth();
    const { employees, updateEmployee } = useData();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('private');


    const targetId = id || user.id;
    const isMe = user.id === targetId;
    const canViewDetails = isMe || user.role === 'admin';
    const canEdit = canViewDetails;
    const employeeData = employees.find(e => e.id === targetId) || (isMe ? user : null);

    const [isEditing, setIsEditing] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        email: '',
        dob: '',
        gender: '',
        maritalStatus: '',
        // Resume Data
        summary: '',
        experience: '',
        skills: ''
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });


    const [salaryData, setSalaryData] = useState({
        wage: 0,
        basic: 0,
        hra: 0,
        stdAllowance: 0,
        pf: 0,
        fixedAllowance: 0
    });


    useEffect(() => {
        if (employeeData) {
            setFormData({
                phone: employeeData.phone || '',
                address: employeeData.address || '',
                email: employeeData.email || '',
                dob: employeeData.dob || '',
                gender: employeeData.gender || '',
                maritalStatus: employeeData.maritalStatus || '',
                summary: employeeData.summary || '',
                experience: employeeData.experience || '',
                skills: employeeData.skills || ''
            });

            // Init mock salary if not exists

            const baseWage = employeeData.salary || 60000;
            calculateSalaryComponents(baseWage);
        }
    }, [employeeData]);

    const calculateSalaryComponents = (wage) => {
        const basic = wage * 0.50;
        const hra = basic * 0.50;
        const stdAllowance = 4167; // Fixed as per example text
        const pf = 1800; // Mock fixed
        const totalComponents = basic + hra + stdAllowance + pf;
        const fixedAllowance = wage > totalComponents ? wage - totalComponents : 0;

        setSalaryData({
            wage,
            basic,
            hra,
            stdAllowance,
            pf,
            fixedAllowance
        });
    };

    const handleWageChange = (newWage) => {
        calculateSalaryComponents(Number(newWage));
    };

    const handleSave = () => {
        updateEmployee({
            ...employeeData,
            ...formData,
            salary: salaryData.wage
        });
        setIsEditing(false);
    };


    const handlePasswordUpdate = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        // Verify current password (simple check since we handle persistence)
        // In a real app, this would be a backend call
        if (employeeData.password && employeeData.password !== passwordData.currentPassword) {
            alert("Current password is incorrect.");
            return;
        }

        updateEmployee({
            ...employeeData,
            password: passwordData.newPassword
        });

        alert("Password updated successfully!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    if (!employeeData) return <div style={{ color: 'white' }}>Employee not found</div>;


    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#e5e5e5' }}>
            {/* Header Card */}
            <div className="card" style={{ background: '#262626', border: '1px solid #404040', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#A855F7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white',
                    border: '4px solid #404040'
                }}>
                    {employeeData.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>{employeeData.name}</h1>
                    <p style={{ color: '#aaa', marginTop: '0.25rem' }}>{employeeData.jobTitle} • {employeeData.department}</p>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#bbb' }}><Mail size={16} /> {employeeData.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#bbb' }}><Phone size={16} /> {employeeData.phone || 'N/A'}</span>
                    </div>
                </div>
                {canEdit && (
                    <button className="btn btn-secondary" style={{ background: '#F87171', color: 'white', border: 'none' }} onClick={() => isEditing ? handleSave() : setIsEditing(!isEditing)}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                )}
            </div>


            {/* Tabs & Content - Restricted Access */}
            {canViewDetails ? (
                <>
                    <div style={{ borderBottom: '1px solid #404040', display: 'flex', marginBottom: '2rem' }}>

                        <TabButton id="private" label="Private Info" icon={User} activeTab={activeTab} setActiveTab={setActiveTab} />
                        {user.role === 'admin' && (
                            <TabButton id="salary" label="Salary Info" icon={CreditCard} activeTab={activeTab} setActiveTab={setActiveTab} />
                        )}
                        <TabButton id="resume" label="Resume" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="security" label="Security" icon={Shield} activeTab={activeTab} setActiveTab={setActiveTab} />

                    </div>

                    <div className="animate-fade-in">
                        {activeTab === 'private' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #404040', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#F87171' }}>Contact Information</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <EditableField label="Address" value={employeeData.address} field="address" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                                        <EditableField label="Email" value={employeeData.email} field="email" type="email" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                                        <EditableField label="Phone" value={employeeData.phone} field="phone" type="tel" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #404040', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#F87171' }}>Personal Details</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <EditableField label="Date of Birth" value={employeeData.dob} field="dob" type="date" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                                        <EditableField label="Gender" value={employeeData.gender} field="gender" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                                        <EditableField label="Marital Status" value={employeeData.maritalStatus} field="maritalStatus" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'salary' && (
                            <div style={{ background: '#0e0e0e', padding: '2.5rem', borderRadius: '8px', border: '1px solid #333', color: 'white', fontFamily: 'monospace' }}>

                                {/* Centered Header Button-like */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                                    <div style={{
                                        border: '1px solid #444',
                                        padding: '0.5rem 2rem',
                                        borderRadius: '4px',
                                        background: '#1a1a1a',
                                        color: '#ccc',
                                        letterSpacing: '1px'
                                    }}>
                                        Salary Info
                                    </div>
                                </div>

                                {/* Top Info Section */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '3rem' }}>
                                    {/* Wage Info */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <span style={{ color: '#aaa' }}>Month Wage</span>
                                            <div style={{ borderBottom: '1px solid #666', paddingBottom: '5px', width: '60%', textAlign: 'right' }}>
                                                <span style={{ fontSize: '1.1rem' }}>{salaryData.wage.toLocaleString()}</span>
                                                <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '8px' }}>/ Month</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <span style={{ color: '#aaa' }}>Yearly Wage</span>
                                            <div style={{ borderBottom: '1px solid #666', paddingBottom: '5px', width: '60%', textAlign: 'right' }}>
                                                <span style={{ fontSize: '1.1rem' }}>{(salaryData.wage * 12).toLocaleString()}</span>
                                                <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '8px' }}>/ Yearly</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Work Info */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <span style={{ color: '#aaa', width: '50%' }}>No of working days in a week:</span>
                                            <input
                                                type="text"
                                                defaultValue="5"
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    borderBottom: '1px solid #fff',
                                                    color: 'white',
                                                    textAlign: 'right',
                                                    width: '40%',
                                                    outline: 'none',
                                                    paddingBottom: '5px'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <span style={{ color: '#aaa' }}>Break Time:</span>
                                            <div style={{ width: '40%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                <input
                                                    type="text"
                                                    defaultValue="1"
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        borderBottom: '1px solid #fff',
                                                        color: 'white',
                                                        textAlign: 'right',
                                                        width: '100%',
                                                        outline: 'none',
                                                        paddingBottom: '5px'
                                                    }}
                                                />
                                                <span style={{ color: '#666', fontSize: '0.9rem', marginLeft: '5px', whiteSpace: 'nowrap' }}>/ hrs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Salary Components */}
                                <div style={{ marginBottom: '3rem' }}>
                                    <h3 style={{ color: '#aaa', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Salary Components</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {/* Basic */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ width: '40%' }}>
                                                <div style={{ color: '#ddd' }}>Basic Salary</div>
                                                <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>Define Basic salary from company cost compute it based on monthly Wages</div>
                                            </div>
                                            <input defaultValue={`${salaryData.basic.toFixed(2)} / month`} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '30%', paddingBottom: '5px' }} />
                                            <input defaultValue="50.00 %" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '15%', paddingBottom: '5px' }} />
                                        </div>

                                        {/* HRA */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ width: '40%' }}>
                                                <div style={{ color: '#ddd' }}>House Rent Allowance</div>
                                                <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>HRA provided to employees 50% of the basic salary</div>
                                            </div>
                                            <input defaultValue={`${salaryData.hra.toFixed(2)} / month`} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '30%', paddingBottom: '5px' }} />
                                            <input defaultValue="50.00 %" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '15%', paddingBottom: '5px' }} />
                                        </div>

                                        {/* Std Allowance */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ width: '40%' }}>
                                                <div style={{ color: '#ddd' }}>Standard Allowance</div>
                                                <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>A standard allowance is a predetermined, fixed amount provided to employee as part of their salary</div>
                                            </div>
                                            <input defaultValue={`${salaryData.stdAllowance.toFixed(2)} / month`} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '30%', paddingBottom: '5px' }} />
                                            <input defaultValue="16.67 %" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '15%', paddingBottom: '5px' }} />
                                        </div>

                                        {/* Performance Bonus (Fixed Mock for Visual) */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ width: '40%' }}>
                                                <div style={{ color: '#ddd' }}>Performance Bonus</div>
                                                <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary</div>
                                            </div>
                                            <input defaultValue="2082.50 / month" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '30%', paddingBottom: '5px' }} />
                                            <input defaultValue="8.33 %" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '15%', paddingBottom: '5px' }} />
                                        </div>

                                        {/* Fixed Allowance */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ width: '40%' }}>
                                                <div style={{ color: '#ddd' }}>Fixed Allowance</div>
                                                <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>Fixed allowance portion of wages is determined after calculating all salary components</div>
                                            </div>
                                            <input defaultValue={`${salaryData.fixedAllowance.toFixed(2)} / month`} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '30%', paddingBottom: '5px' }} />
                                            <input defaultValue="11.67 %" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '15%', paddingBottom: '5px' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Split - PF and Tax */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>

                                    {/* PF */}
                                    <div>
                                        <h3 style={{ color: '#aaa', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Provident Fund (PF) Contribution</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ color: '#ddd' }}>Employee</div>
                                                <input defaultValue={`${salaryData.pf.toFixed(2)} / month`} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '40%', paddingBottom: '5px' }} />
                                                <input defaultValue="12.00 %" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '20%', paddingBottom: '5px' }} />
                                            </div>
                                            <div style={{ color: '#666', fontSize: '0.75rem' }}>PF is calculated based on the basic salary</div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                                <div style={{ color: '#ddd' }}>Employer's</div>
                                                <input defaultValue={`${salaryData.pf.toFixed(2)} / month`} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '40%', paddingBottom: '5px' }} />
                                                <input defaultValue="12.00 %" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '20%', paddingBottom: '5px' }} />
                                            </div>
                                            <div style={{ color: '#666', fontSize: '0.75rem' }}>PF is calculated based on the basic salary</div>
                                        </div>
                                    </div>

                                    {/* Tax */}
                                    <div>
                                        <h3 style={{ color: '#aaa', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Tax Deductions</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ color: '#ddd' }}>Professional Tax</div>
                                            <input defaultValue="200.00 / month" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', textAlign: 'right', width: '50%', paddingBottom: '5px' }} />
                                        </div>
                                        <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>Professional Tax deducted from the Gross salary</div>
                                    </div>
                                </div>

                            </div>
                        )}


                        {activeTab === 'resume' && (
                            <div style={{ maxWidth: '800px' }}>
                                <h3 style={{ borderBottom: '1px solid #404040', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#F87171' }}>Resume & Skills</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div>
                                        <label style={{ color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>Professional Summary</label>
                                        {isEditing ? (
                                            <textarea
                                                value={formData.summary}
                                                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                                                rows={4}
                                                style={{ background: '#333', border: '1px solid #555', color: 'white', padding: '0.75rem', borderRadius: '4px', width: '100%', fontFamily: 'inherit' }}
                                                placeholder="Brief summary of professional background..."
                                            />
                                        ) : (
                                            <div style={{ color: 'white', lineHeight: '1.6', background: '#262626', padding: '1rem', borderRadius: '4px' }}>
                                                {formData.summary || <span style={{ color: '#666', fontStyle: 'italic' }}>No summary added yet.</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label style={{ color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>Experience</label>
                                        {isEditing ? (
                                            <textarea
                                                value={formData.experience}
                                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                                rows={6}
                                                style={{ background: '#333', border: '1px solid #555', color: 'white', padding: '0.75rem', borderRadius: '4px', width: '100%', fontFamily: 'inherit' }}
                                                placeholder="List your work experience..."
                                            />
                                        ) : (
                                            <div style={{ color: 'white', whiteSpace: 'pre-wrap', lineHeight: '1.6', background: '#262626', padding: '1rem', borderRadius: '4px' }}>
                                                {formData.experience || <span style={{ color: '#666', fontStyle: 'italic' }}>No experience details added yet.</span>}
                                            </div>
                                        )}
                                    </div>

                                    <EditableField
                                        label="Key Skills"
                                        value={formData.skills}
                                        field="skills"
                                        isEditing={isEditing}
                                        formData={formData}
                                        setFormData={setFormData}
                                        placeholder="React, Node.js, Leadership..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div style={{ maxWidth: '600px' }}>
                                <h3 style={{ borderBottom: '1px solid #404040', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#F87171' }}>Security Settings</h3>

                                <div className="card" style={{ background: '#262626', padding: '2rem', border: '1px solid #404040' }}>
                                    <h4 style={{ color: 'white', marginTop: 0, marginBottom: '1.5rem' }}>Change Password</h4>

                                    <form onSubmit={handlePasswordUpdate}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                style={{ background: '#333', border: '1px solid #555', color: 'white', padding: '0.75rem', borderRadius: '4px', width: '100%' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                style={{ background: '#333', border: '1px solid #555', color: 'white', padding: '0.75rem', borderRadius: '4px', width: '100%' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.confirmPassword}
                                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                style={{ background: '#333', border: '1px solid #555', color: 'white', padding: '0.75rem', borderRadius: '4px', width: '100%' }}
                                            />
                                        </div>

                                        <button type="submit" className="btn" style={{ background: '#A855F7', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
                                            Update Password
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                    </div>
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    background: '#262626',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: '#888'
                }}>
                    <Shield size={48} style={{ marginBottom: '1rem', color: '#F87171' }} />
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Restricted Access</h3>
                    <p>You do not have permission to view detailed profile information for this employee.</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
