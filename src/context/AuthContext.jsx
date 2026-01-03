import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted session
        const storedUser = localStorage.getItem('hrms_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3001/api/employees/login-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loginId: email, password })
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('hrms_user', JSON.stringify(data.user)); // Keep session locally
                return data.user;
            } else {
                throw data.message || 'Invalid credentials';
            }
        } catch (error) {
            throw typeof error === 'string' ? error : 'Login failed. Check server connection.';
        }
    };

    const setAuthenticatedUser = (userObj) => {
        setUser(userObj);
        localStorage.setItem('hrms_user', JSON.stringify(userObj));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hrms_user');
    };

    const register = (data) => {
        // Mock Register
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: `EMP${Math.floor(Math.random() * 1000)}`,
                    ...data,
                    role: data.role || 'employee',
                    avatar: `https://ui-avatars.com/api/?name=${data.name}&background=random`
                };
                setUser(newUser);
                localStorage.setItem('hrms_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 800);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, setAuthenticatedUser }}>
            {children}
        </AuthContext.Provider>
    );
};
