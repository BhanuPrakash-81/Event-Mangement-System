import React, { useEffect, useState } from "react";
import API from "../Api";

function AttendeeList() {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    const res = await API.get("/attendees");
    setAttendees(res.data);
  };

  return (
    <div>
      <h2>Attendees</h2>
      <ul>
        {attendees.map((a) => (
          <li key={a.id}>
            {a.username} → {a.eventName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendeeList;