import React, { useState, useEffect } from "react";
import API from "./Api";
import CreateEvent from "./components/CreateEvent";
import EventList from "./components/EventList";
import RegisterEvent from "./components/RegisterEvent";
import AttendeeList from "./components/AttendeeList";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);

  // 🔥 Fetch Events
  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  // 🔥 Fetch Attendees
  const fetchAttendees = async () => {
    const res = await API.get("/attendees");
    setAttendees(res.data);
  };

  useEffect(() => {
    fetchEvents();
    fetchAttendees();
  }, []);

  return (
    <div className="container">
      <h1>Event Management System</h1>

      <div className="card">
        <CreateEvent refreshEvents={fetchEvents} />
      </div>

      <div className="card">
        <EventList events={events} />
      </div>

      <div className="card">
        <RegisterEvent refreshAttendees={fetchAttendees} />
      </div>

      <div className="card">
        <AttendeeList attendees={attendees} />
      </div>
    </div>
  );
}

export default App;