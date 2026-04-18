import React, { useEffect, useState } from "react";
import API from "../Api";

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Event List</h2>
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            {e.name} | {e.date} | {e.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;