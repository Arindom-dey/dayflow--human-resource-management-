import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="layout-container" style={{ display: 'block', background: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
            <Navbar />
            <main className="main-content animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', marginLeft: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
