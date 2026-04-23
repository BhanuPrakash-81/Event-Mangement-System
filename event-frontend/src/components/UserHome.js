import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/background.jpg';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function UserHome() {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [ticket, setTicket] = useState(null);
    const navigate = useNavigate();
    
    // Get user from localStorage
    const savedUser = React.useMemo(() => JSON.parse(localStorage.getItem('user')), []);

    const fetchData = useCallback(() => {
        axios.get(API_BASE_URL + "/events")
            .then(res => setEvents(res.data))
            .catch(err => console.log(err));

        axios.get(API_BASE_URL + "/registrations")
            .then(res => setRegistrations(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (!savedUser) {
            navigate('/');
            return;
        }
        fetchData();
    }, [fetchData, navigate, savedUser]);

    const handleRegister = (eventId) => {
        axios.post(API_BASE_URL + "/registrations", {
            user: { id: savedUser.id },
            event: { id: eventId }
        })
        .then(res => {
            setTicket({
                eventId: eventId,
                ticketNumber: res.data.ticketNumber
            });
            fetchData();
        })
        .catch(err => {
            alert(err.response?.data || "Registration failed.");
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="app-container" style={{ backgroundImage: `url(${bg})`, minHeight: '100vh' }}>
            <div className="top-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>
                <h1 className="app-title" style={{ margin: 0 }}>Event Hub</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span>Welcome, <strong>{savedUser?.name}</strong></span>
                    <button className="btn-outline" onClick={handleLogout} style={{ padding: '8px 20px' }}>Logout</button>
                </div>
            </div>

            <div className="events-grid" style={{ padding: '40px' }}>
                {events.map((event) => {
                    const attendees = registrations.filter(r => r.event.id === event.id);
                    const isCompleted = new Date(event.eventDate) < new Date();
                    const isRegistered = attendees.some(r => r.user.id === savedUser?.id);

                    return (
                        <div key={event.id} className="event-card">
                            <div className="image-container">
                                <img src={event.photo || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"} alt="event" className="event-image" />
                            </div>

                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-desc">{event.description}</p>
                            
                            <div className="event-details">
                                <span className="event-venue">📍 {event.venue}</span>
                                <span className={`status-badge ${isCompleted ? 'status-completed' : 'status-upcoming'}`}>
                                    {isCompleted ? "Completed" : "Upcoming"}
                                </span>
                            </div>

                            <button
                                className="btn-primary"
                                disabled={isCompleted || attendees.length >= event.maxAttendees || isRegistered}
                                onClick={() => handleRegister(event.id)}
                            >
                                {isRegistered ? "Already Registered" : isCompleted ? "Event Expired" : attendees.length >= event.maxAttendees ? "Sold Out" : "Register Now"}
                            </button>

                            <div className="attendees-section">
                                <h4 className="attendees-title">Attendees ({attendees.length}/{event.maxAttendees})</h4>
                                <div className="attendees-list">
                                    {attendees.map((r, i) => (
                                        <p key={i} className="attendee-item">👤 {r.user.name} {r.user.id === savedUser?.id && "(You)"}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* TICKET POPUP */}
            {ticket && (
                <div className="modal-overlay">
                    <div className="modal-content ticket-content">
                        <h2 className="ticket-header">🎉 Registration Confirmed!</h2>
                        <p className="event-desc">Your ticket has been generated successfully.</p>
                        <div className="ticket-detail"><strong>Ticket Number:</strong> {ticket.ticketNumber}</div>
                        <button className="btn-primary" style={{marginTop: "20px"}} onClick={() => setTicket(null)}>Done</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserHome;
