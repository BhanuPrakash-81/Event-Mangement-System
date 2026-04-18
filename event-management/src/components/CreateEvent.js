import React, { useState } from "react";
import API from "../Api";

function CreateEvent({ refreshEvents }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/events", {
      name,
      date,
      status: "Upcoming"
    });

    refreshEvents(); // 🔥 refresh list
    setName("");
    setDate("");
  };

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          placeholder="Event Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateEvent;