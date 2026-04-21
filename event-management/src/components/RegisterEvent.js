import React, { useState, useEffect } from "react";
import API from "../Api";

function RegisterEvent({ refreshAttendees }) {
  const [username, setUsername] = useState("");
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/attendees", {
      username,
      eventName
    });

    refreshAttendees(); // 🔥 refresh list
    setUsername("");
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={username}
          placeholder="Your Name"
          onChange={(e) => setUsername(e.target.value)}
        />

        <select onChange={(e) => setEventName(e.target.value)}>
          <option>Select Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterEvent;