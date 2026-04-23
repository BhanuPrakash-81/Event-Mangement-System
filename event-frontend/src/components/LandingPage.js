import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/background.jpg';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function LandingPage() {
    const [isLoginModal, setIsLoginModal] = useState(false);
    const [isSignupModal, setIsSignupModal] = useState(false);
    const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAuthChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: authData.email,
                password: authData.password
            });
            localStorage.setItem('user', JSON.stringify(res.data));
            if (res.data.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data || "Login failed");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/auth/signup`, authData);
            alert("Signup successful! Please login.");
            setIsSignupModal(false);
            setIsLoginModal(true);
        } catch (err) {
            setError(err.response?.data || "Signup failed");
        }
    };

    return (
        <div className="landing-container" style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center'
        }}>
            <div className="glass-panel" style={{ 
                padding: '50px',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
                maxWidth: '600px'
            }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '700', letterSpacing: '-1px' }}>
                    Unforgettable <span style={{ color: '#00f0ff' }}>Events</span> Start Here
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#a0a0a0', marginBottom: '40px', lineHeight: '1.6' }}>
                    Join the most exclusive platform for managing and discovering top-tier technical and social events.
                </p>
                
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => setIsLoginModal(true)} style={{ padding: '15px 40px', borderRadius: '12px' }}>
                        Login
                    </button>
                    <button className="btn-outline" onClick={() => setIsSignupModal(true)} style={{ padding: '15px 40px', borderRadius: '12px' }}>
                        Join Now
                    </button>
                </div>
            </div>

            {/* Auth Modal Selection */}
            {(isLoginModal || isSignupModal) && (
                <div className="modal-overlay" onClick={() => { setIsLoginModal(false); setIsSignupModal(false); setError(''); }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'rgba(20, 20, 25, 0.95)', border: '1px solid var(--primary-color)' }}>
                        <h2 style={{ marginBottom: '25px', textAlign: 'center' }}>{isLoginModal ? 'Welcome Back' : 'Create Account'}</h2>
                        
                        {error && <p style={{ color: 'var(--danger-color)', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
                        
                        <form onSubmit={isLoginModal ? handleLogin : handleSignup}>
                            {!isLoginModal && (
                                <div className="input-group">
                                    <input name="name" type="text" placeholder="Full Name" className="custom-input" value={authData.name} onChange={handleAuthChange} required />
                                </div>
                            )}
                            <div className="input-group">
                                <input name="email" type="email" placeholder="Email Address" className="custom-input" value={authData.email} onChange={handleAuthChange} required />
                            </div>
                            <div className="input-group">
                                <input name="password" type="password" placeholder="Password" className="custom-input" value={authData.password} onChange={handleAuthChange} required />
                            </div>
                            
                            <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '10px' }}>
                                {isLoginModal ? 'Login' : 'Sign Up'}
                            </button>
                        </form>

                        {isLoginModal && (
                            <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Quick Test Access:</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '5px 10px', flex: 1 }} onClick={() => setAuthData({ ...authData, email: 'admin@admin.com', password: 'admin' })}>
                                        Admin
                                    </button>
                                    <button className="btn-outline" style={{ fontSize: '0.8rem', padding: '5px 10px', flex: 1 }} onClick={() => setAuthData({ ...authData, email: 'user@test.com', password: 'user' })}>
                                        User
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            {isLoginModal ? "Don't have an account? " : "Already have an account? "}
                            <span 
                                style={{ color: 'var(--primary-color)', cursor: 'pointer' }} 
                                onClick={() => { setIsLoginModal(!isLoginModal); setIsSignupModal(!isSignupModal); setError(''); }}
                            >
                                {isLoginModal ? 'Sign Up' : 'Login'}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
