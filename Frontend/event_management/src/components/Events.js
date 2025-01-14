import React, { useEffect, useState } from 'react';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: '',
    attendees: '',
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/apis/api/events/')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleAddEvent = () => {
    fetch('http://127.0.0.1:8000/apis/api/events/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventDetails),
    })
      .then((response) => response.json())
      .then((newEvent) => {
        
        fetch('http://127.0.0.1:8000/apis/api/events/')
          .then((response) => response.json())
          .then((data) => setEvents(data))
          .catch((error) => console.error('Error fetching events:', error));

        
        setEventDetails({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: '',
          capacity: '',
          attendees: '',
        });
      })
      .catch((error) => console.error('Error adding event:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/apis/api/events/${id}/delete/`, { method: 'DELETE' })
      .then(() => setEvents(events.filter((event) => event.id !== id)))
      .catch((error) => console.error('Error deleting event:', error));
  };

  const handleUpdate = (id) => {
    fetch(`http://127.0.0.1:8000/apis/api/events/${id}/update/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventDetails),
    })
      .then((response) => response.json())
      .then((updatedEvent) => {
        setEvents(events.map((event) => (event.id === id ? updatedEvent : event)));
      })
      .catch((error) => console.error('Error updating event:', error));
  };

  return (
    <div className="container">
      <h1 className="heading">Event Management</h1>
      <div className="form">
        <h2>Add Event</h2>
        <input name="title" placeholder="Title" value={eventDetails.title} onChange={handleChange} />
        <input name="description" placeholder="Description" value={eventDetails.description} onChange={handleChange} />
        <input type="date" name="date" value={eventDetails.date} onChange={handleChange} />
        <input type="time" name="time" value={eventDetails.time} onChange={handleChange} />
        <input name="location" placeholder="Location" value={eventDetails.location} onChange={handleChange} />
        <select name="category" value={eventDetails.category} onChange={handleChange}>
          <option value="Workshop">Workshop</option>
          <option value="Conference">Conference</option>
          <option value="Party">Party</option>
        </select>
        <input type="number" name="capacity" placeholder="Capacity" value={eventDetails.capacity} onChange={handleChange} />
        <input type="number" name="attendees" placeholder="Attendees" value={eventDetails.attendees} onChange={handleChange} />
        <button className="button" onClick={handleAddEvent}>Add Event</button>
      </div>

      <div className="event-list">
        <h2>Completed Events</h2>
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>{event.date}</p>
              <p>{event.time}</p>
              <p>{event.location}</p>
              <p>{event.category}</p>
              <p>Capacity: {event.capacity}</p>
              <p>Attendees: {event.attendees}</p>
              <button className="button" onClick={() => handleDelete(event.id)}>Delete</button>
              <button className="button" onClick={() => setEventDetails(event)}>Update</button>
              <button className="button" onClick={() => handleUpdate(event.id)}>Save Changes</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
