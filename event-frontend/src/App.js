import { useEffect, useState, useRef, useCallback } from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from "axios";
import bg from "./assets/background.jpg";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function App() {
  const [viewRole, setViewRole] = useState("USER"); // "USER" or "ADMIN"
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // 🎟️ User Logic
  const [ticket, setTicket] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "USER" });

  // 🛡️ Admin Logic
  const [editingEventId, setEditingEventId] = useState(null);
  const [adminEvent, setAdminEvent] = useState({
    title: "", description: "", venue: "", eventDate: "", maxAttendees: 100, currentRegistrations: 0, status: "UPCOMING", photo: ""
  });

  // ✂️ Cropper Logic
  const imgRef = useRef(null);
  const [upImg, setUpImg] = useState();
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  // 🔄 Fetch Data
  const fetchData = () => {
    axios.get(API_BASE_URL + "/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));

    axios.get(API_BASE_URL + "/registrations")
      .then(res => setRegistrations(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🧾 User Handle input
  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🧾 Admin Handle input
  const handleAdminChange = (e) => {
    setAdminEvent({ ...adminEvent, [e.target.name]: e.target.value });
  };

  // 📸 Admin Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUpImg(reader.result);
        setCrop({ unit: '%', width: 90, aspect: 16/9 }); // Start with a default crop box
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
    // Clear input so same file triggers change again if re-selected
    if(e.target) e.target.value = null;
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
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Save newly cropped base64 string
    const base64Image = canvas.toDataURL('image/jpeg');
    setAdminEvent({ ...adminEvent, photo: base64Image });
    setIsCropping(false);
  };

  // 🚀 User Submit form
  const submitUserForm = () => {
    axios.post(API_BASE_URL + "/users", user)
      .then(res => {
        const userId = res.data.id;
        return axios.post(API_BASE_URL + "/registrations", {
          user: { id: userId },
          event: { id: selectedEvent }
        });
      })
      .then(res => {
        setTicket({
          eventId: selectedEvent,
          ticketNumber: res.data.ticketNumber
        });
        return axios.get(API_BASE_URL + "/registrations");
      })
      .then(res => {
        setRegistrations(res.data);
        setShowForm(false);
        setUser({ name: "", email: "", password: "", role: "USER" });
      })
      .catch(err => {
        alert(err.response?.data || "Registration failed. Please try again.");
      });
  };

  // 🚀 Admin Submit Event
  const submitAdminEventDialog = () => {
    if(!adminEvent.title || !adminEvent.eventDate) {
      alert("Title and Date are required!");
      return;
    }

    if (editingEventId) {
      axios.put(`http://localhost:8080/events/${editingEventId}`, adminEvent)
        .then(res => {
          alert("Event successfully updated!");
          setEditingEventId(null);
          setAdminEvent({
            title: "", description: "", venue: "", eventDate: "", maxAttendees: 100, currentRegistrations: 0, status: "UPCOMING", photo: ""
          });
          fetchData();
        })
        .catch(err => alert("Failed to update event."));
    } else {
      axios.post(API_BASE_URL + "/events", adminEvent)
        .then(res => {
          alert("Event successfully created!");
          setAdminEvent({
            title: "", description: "", venue: "", eventDate: "", maxAttendees: 100, currentRegistrations: 0, status: "UPCOMING", photo: ""
          });
          fetchData(); // Refresh list
        })
        .catch(err => {
          alert(err.response?.data || "Failed to create event.");
        });
    }
  };

  // ✏️ Admin Edit Event
  const editEvent = (event) => {
    setEditingEventId(event.id);
    setAdminEvent({
      title: event.title, description: event.description, venue: event.venue, eventDate: event.eventDate, maxAttendees: event.maxAttendees, currentRegistrations: event.currentRegistrations, status: event.status, photo: event.photo || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🗑️ Admin Delete Event
  const deleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      axios.delete(`http://localhost:8080/events/${id}`)
        .then(() => {
          alert("Event deleted successfully!");
          fetchData();
        })
        .catch(err => alert("Failed to delete event."));
    }
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
      
      {/* 🔄 TOP BAR ROLE SWITCHER */}
      <h1 className="app-title">Event Management</h1>
      <div className="role-switcher">
        <button 
          className={`role-btn ${viewRole === "USER" ? "active" : ""}`} 
          onClick={() => setViewRole("USER")}
        >
          User View
        </button>
        <button 
          className={`role-btn ${viewRole === "ADMIN" ? "active" : ""}`} 
          onClick={() => setViewRole("ADMIN")}
        >
          Admin View
        </button>
      </div>

      {/* ===================== ADMIN VIEW ===================== */}
      {viewRole === "ADMIN" && (
        <div className="admin-layout">
          <h2>{editingEventId ? "Edit Event" : "Create New Event"}</h2>
          
          <div className="form-grid">
            <div className="input-group">
              <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", marginLeft: "5px"}}>Event Title</label>
              <input name="title" className="custom-input" placeholder="e.g. Tech Conference 2026" value={adminEvent.title} onChange={handleAdminChange} />
            </div>
            
            <div className="input-group">
              <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", marginLeft: "5px"}}>Venue</label>
              <input name="venue" className="custom-input" placeholder="e.g. Grand Hall, City Center" value={adminEvent.venue} onChange={handleAdminChange} />
            </div>

            <div className="input-group">
              <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", marginLeft: "5px"}}>Date & Time</label>
              <input name="eventDate" type="datetime-local" className="custom-input" value={adminEvent.eventDate} onChange={handleAdminChange} />
            </div>
            
            <div className="input-group">
              <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", marginLeft: "5px"}}>Max Attendees</label>
              <input name="maxAttendees" type="number" className="custom-input" placeholder="100" value={adminEvent.maxAttendees} onChange={handleAdminChange} />
            </div>

            <div className="input-group">
              <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", marginLeft: "5px"}}>Event Photo</label>
              <input type="file" accept="image/*" className="custom-input" onChange={handleFileChange} style={{ padding: "10px" }} />
              {adminEvent.photo && (
                <div style={{ position: "relative" }}>
                  <img src={adminEvent.photo} alt="Preview" style={{ marginTop: "10px", maxHeight: "150px", borderRadius: "8px", objectFit: "cover", width: "100%" }} />
                  <button className="btn-outline" style={{ position: "absolute", top: "15px", right: "10px", padding: "5px 10px", margin: 0, fontSize: "0.8rem", background: "rgba(0,0,0,0.6)", border: "none" }} onClick={(e) => { e.preventDefault(); setAdminEvent({...adminEvent, photo: ""}); }}>Remove</button>
                </div>
              )}
            </div>

            <div className="input-group full-width">
              <label style={{color: "var(--text-secondary)", fontSize: "0.9rem", marginLeft: "5px"}}>Description</label>
              <textarea name="description" className="custom-input" placeholder="Describe the event details..." value={adminEvent.description} onChange={handleAdminChange}></textarea>
            </div>
          </div>

          <button className="btn-primary" style={{marginTop: "20px"}} onClick={submitAdminEventDialog}>
            {editingEventId ? "Update Event" : "Submit Event"}
          </button>
          {editingEventId && (
            <button className="btn-outline" style={{marginTop: "20px", marginLeft: "10px"}} onClick={() => { setEditingEventId(null); setAdminEvent({title: "", description: "", venue: "", eventDate: "", maxAttendees: 100, currentRegistrations: 0, status: "UPCOMING", photo: ""}) }}>Cancel</button>
          )}

          <hr style={{margin: "40px 0", borderColor: "rgba(255,255,255,0.1)"}} />

          <h2>Manage Existing Events</h2>
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card" style={{padding: "15px"}}>
                <h3 className="event-title" style={{fontSize: "1.2rem", marginBottom: "10px"}}>{event.title}</h3>
                <p style={{fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "5px"}}>📍 {event.venue}</p>
                <p style={{fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "15px"}}>📅 {new Date(event.eventDate).toLocaleString()}</p>
                <div style={{display: "flex", gap: "10px"}}>
                  <button className="btn-primary" style={{flex: 1, padding: "8px", fontSize: "0.9rem"}} onClick={() => editEvent(event)}>Edit</button>
                  <button className="btn-outline" style={{flex: 1, padding: "8px", fontSize: "0.9rem", borderColor: "#ff4d4f", color: "#ff4d4f"}} onClick={() => deleteEvent(event.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== USER VIEW ===================== */}
      {viewRole === "USER" && (
        <div className="events-grid">
          {events.map((event, index) => {
            const attendees = registrations.filter(r => r.event.id === event.id);
            const isCompleted = new Date(event.eventDate) < new Date();

            return (
              <div key={event.id} className={`event-card`}>
                <div className="image-container">
                  <img src={event.photo ? event.photo : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="event" className="event-image" />
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
                  disabled={isCompleted || attendees.length >= event.maxAttendees}
                  style={{ opacity: (isCompleted || attendees.length >= event.maxAttendees) ? 0.5 : 1 }}
                  onClick={() => {
                    setSelectedEvent(event.id);
                    setShowForm(true);
                  }}
                >
                  {isCompleted ? "Event Expired" : attendees.length >= event.maxAttendees ? "Sold Out" : "Register Now"}
                </button>

                <div className="attendees-section">
                  <h4 className="attendees-title">Attendees ({attendees.length}/{event.maxAttendees})</h4>
                  <div className="attendees-list">
                    {attendees.length === 0 ? (
                      <p className="attendee-empty">No registrations yet.</p>
                    ) : (
                      attendees.map((r, i) => (
                        <p key={i} className="attendee-item">👤 {r.user.name}</p>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🧾 FORM POPUP */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sign Up for Event</h2>
            <div className="input-group">
              <input name="name" className="custom-input" placeholder="Full Name" value={user.name} onChange={handleUserChange} />
            </div>
            <div className="input-group">
              <input name="email" className="custom-input" placeholder="Email Address" value={user.email} onChange={handleUserChange} />
            </div>
            <div className="input-group">
              <input name="password" type="password" className="custom-input" placeholder="Secure Password" value={user.password} onChange={handleUserChange} />
            </div>
            <button className="btn-primary" onClick={submitUserForm}>Submit Registration</button>
            <button className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* 🎟️ TICKET POPUP */}
      {ticket && (
        <div className="modal-overlay">
          <div className="modal-content ticket-content">
            <h2 className="ticket-header">🎉 Success!</h2>
            <p className="event-desc" style={{marginBottom: "20px"}}>You have successfully registered.</p>
            <div className="ticket-detail">
              <strong>Event ID</strong> {ticket.eventId}
            </div>
            <div className="ticket-detail">
              <strong>Ticket Number</strong> {ticket.ticketNumber}
            </div>
            <button className="btn-primary" style={{marginTop: "20px"}} onClick={() => setTicket(null)}>Done</button>
          </div>
        </div>
      )}

      {/* ✂️ CROPPER MODAL */}
      {isCropping && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', width: '95%', padding: '30px' }}>
            <h2 style={{ marginBottom: "20px" }}>Frame Your Event Photo</h2>
            <div style={{ maxHeight: '55vh', overflowY: 'auto', marginBottom: '25px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
              <ReactCrop 
                crop={crop} 
                onChange={(c) => setCrop(c)} 
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
              >
                <img 
                  src={upImg} 
                  onLoad={(e) => onLoad(e.currentTarget)}
                  style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }} 
                  alt="Crop preview" 
                />
              </ReactCrop>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                className="btn-primary" 
                onClick={getCroppedImg}
                disabled={!completedCrop?.width || !completedCrop?.height}
              >
                Apply Crop
              </button>
              <button 
                className="btn-outline" 
                style={{ marginTop: 0 }}
                onClick={() => { setIsCropping(false); setUpImg(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
