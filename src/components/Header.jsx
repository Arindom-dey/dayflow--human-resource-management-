import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid transparent' // Placeholder for sticky header if needed
        }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                    Welcome back, {user?.name.split(' ')[0]}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Here is what's happening today.
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--danger)',
                        borderRadius: '50%',
                        border: '2px solid var(--bg-body)'
                    }}></span>
                    <Bell size={20} color="var(--text-secondary)" cursor="pointer" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                        src={user?.avatar}
                        alt={user?.name}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid white',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
