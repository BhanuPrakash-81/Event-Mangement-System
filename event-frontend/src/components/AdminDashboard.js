import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/background.jpg';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [adminEvent, setAdminEvent] = useState({
        title: "", description: "", venue: "", eventDate: "", maxAttendees: 100, currentRegistrations: 0, status: "UPCOMING", photo: ""
    });
    const [editingEventId, setEditingEventId] = useState(null);
    const navigate = useNavigate();
    const savedUser = React.useMemo(() => JSON.parse(localStorage.getItem('user')), []);

    // Cropper State
    const imgRef = useRef(null);
    const [upImg, setUpImg] = useState();
    const [crop, setCrop] = useState({});
    const [completedCrop, setCompletedCrop] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const fetchEvents = useCallback(() => {
        axios.get(API_BASE_URL + "/events")
            .then(res => setEvents(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (!savedUser || savedUser.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchEvents();
    }, [fetchEvents, navigate, savedUser]);

    const handleAdminChange = (e) => {
        setAdminEvent({ ...adminEvent, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setUpImg(reader.result);
                setCrop({ unit: '%', width: 90, aspect: 16/9 });
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    const getCroppedImg = () => {
        if (!completedCrop || !imgRef.current) return;
        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
        canvas.width = Math.round(completedCrop.width * scaleX);
        canvas.height = Math.round(completedCrop.height * scaleY);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            imgRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0, 0, canvas.width, canvas.height
        );
        const base64Image = canvas.toDataURL('image/jpeg');
        setAdminEvent({ ...adminEvent, photo: base64Image });
        setIsCropping(false);
    };

    const submitEvent = () => {
        if (editingEventId) {
            axios.put(`${API_BASE_URL}/events/${editingEventId}`, adminEvent)
                .then(() => {
                    alert("Event updated!");
                    resetForm();
                    fetchEvents();
                });
        } else {
            axios.post(API_BASE_URL + "/events", adminEvent)
                .then(() => {
                    alert("Event created!");
                    resetForm();
                    fetchEvents();
                });
        }
    };

    const resetForm = () => {
        setEditingEventId(null);
        setAdminEvent({
            title: "", description: "", venue: "", eventDate: "", maxAttendees: 100, currentRegistrations: 0, status: "UPCOMING", photo: ""
        });
    };

    const deleteEvent = (id) => {
        if (window.confirm("Delete this event?")) {
            axios.delete(`${API_BASE_URL}/events/${id}`).then(() => fetchEvents());
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="app-container" style={{ backgroundImage: `url(${bg})`, minHeight: '100vh' }}>
            <div className="top-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>
                <h1 className="app-title" style={{ margin: 0 }}>Admin Portal</h1>
                <button className="btn-outline" onClick={handleLogout}>Logout</button>
            </div>

            <div className="admin-layout" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
                <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
                    <h2>{editingEventId ? "Edit Event" : "Create New Event"}</h2>
                    <div className="form-grid">
                        <input name="title" className="custom-input" placeholder="Event Title" value={adminEvent.title} onChange={handleAdminChange} />
                        <input name="venue" className="custom-input" placeholder="Venue" value={adminEvent.venue} onChange={handleAdminChange} />
                        <input name="eventDate" type="datetime-local" className="custom-input" value={adminEvent.eventDate} onChange={handleAdminChange} />
                        <input name="maxAttendees" type="number" className="custom-input" placeholder="Max Attendees" value={adminEvent.maxAttendees} onChange={handleAdminChange} />
                        <input type="file" accept="image/*" className="custom-input" onChange={handleFileChange} />
                    </div>
                    <textarea name="description" className="custom-input" placeholder="Description" value={adminEvent.description} onChange={handleAdminChange} style={{ marginTop: '20px', height: '100px' }}></textarea>
                    
                    <div style={{ marginTop: '20px' }}>
                        <button className="btn-primary" onClick={submitEvent}>{editingEventId ? "Update" : "Create"}</button>
                        {editingEventId && <button className="btn-outline" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
                    </div>
                </div>

                <div className="events-grid">
                    {events.map((event) => (
                        <div key={event.id} className="event-card" style={{ padding: '20px' }}>
                            <h3>{event.title}</h3>
                            <p>📍 {event.venue}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setEditingEventId(event.id); setAdminEvent(event); }}>Edit</button>
                                <button className="btn-outline" style={{ flex: 1, borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }} onClick={() => deleteEvent(event.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CROPPER MODAL */}
            {isCropping && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '700px' }}>
                        <h2>Crop Event Photo</h2>
                        <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={16/9}>
                            <img src={upImg} onLoad={e => onLoad(e.currentTarget)} alt="crop" style={{ maxWidth: '100%' }} />
                        </ReactCrop>
                        <div style={{ marginTop: '20px' }}>
                            <button className="btn-primary" onClick={getCroppedImg}>Apply</button>
                            <button className="btn-outline" onClick={() => setIsCropping(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
