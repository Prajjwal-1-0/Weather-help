import React, { useState } from 'react';
import './Calendar.css';
import { format } from 'date-fns';

const Calendar = ({ onEventAdd, currentLocation }) => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('weatherEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    location: '', // Required field
    isOutdoor: false // Whether the event is outdoor or indoor
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`);
    
    try {
      // Fetch forecast for the event time
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      if (!newEvent.location.trim()) {
        alert('Location is required to check weather forecast');
        return;
      }
      const location = newEvent.location;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Find the closest forecast time to the event
      const forecast = data.list.reduce((closest, current) => {
        const currentDiff = Math.abs(new Date(current.dt * 1000) - eventDateTime);
        const closestDiff = Math.abs(new Date(closest.dt * 1000) - eventDateTime);
        return currentDiff < closestDiff ? current : closest;
      });

      const newEventWithWeather = {
        ...newEvent,
        id: Date.now(),
        weather: {
          description: forecast.weather[0].description,
          temp: Math.round(forecast.main.temp),
          icon: forecast.weather[0].icon
        }
      };

      const updatedEvents = [...events, newEventWithWeather];
      setEvents(updatedEvents);
      localStorage.setItem('weatherEvents', JSON.stringify(updatedEvents));
      
      // Reset form
      setNewEvent({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        location: '',
        isOutdoor: false
      });
    } catch (error) {
      alert('Error fetching weather forecast: ' + error.message);
    }
  };

  const deleteEvent = (id) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('weatherEvents', JSON.stringify(updatedEvents));
  };

  const getWeatherMessage = (event) => {
    const weather = event.weather;
    let message = `Weather for ${event.title} in ${event.location}: `;
    let advice = '';

    if (event.isOutdoor) {
      if (weather.description.includes('rain')) {
        message += `Rainy conditions expected (${weather.temp}°C). `;
        advice = `Don't forget to bring umbrellas and waterproof gear to ${event.title}. You might want a backup plan just in case.`;
      } else if (weather.description.includes('snow')) {
        message += `Snowy weather expected (${weather.temp}°C). `;
        advice = `For ${event.title}, warm waterproof clothing and boots will be essential. Check travel conditions before heading out.`;
      } else if (weather.description.includes('thunder')) {
        message += `Thunderstorms expected (${weather.temp}°C). `;
        advice = `${event.title} might need to be rescheduled for safety - we'll keep you updated on conditions.`;
      } else if (weather.temp < 10) {
        message += `Cold conditions (${weather.temp}°C). `;
        advice = `Bundle up for ${event.title} with warm layers and winter accessories.`;
      } else if (weather.temp > 28) {
        message += `Hot conditions (${weather.temp}°C). `;
        advice = `For ${event.title}, bring plenty of water, sunscreen, and try to find shaded areas.`;
      } else if (weather.temp > 22) {
        message += `Warm and pleasant (${weather.temp}°C). `;
        advice = `Perfect weather for ${event.title}! Just remember sunscreen and stay hydrated.`;
      } else {
        message += `${weather.description} (${weather.temp}°C). `;
        advice = `Looking good for ${event.title}! Weather conditions are favorable.`;
      }
    } else {
      message += `${weather.description} (${weather.temp}°C). `;
      if (weather.description.includes('rain') || weather.description.includes('snow')) {
        advice = `Allow extra travel time to reach ${event.title}.`;
      } else if (weather.temp < 5 || weather.temp > 30) {
        advice = `Dress comfortably for your journey to ${event.title}.`;
      } else {
        advice = `Should be a pleasant trip to ${event.title}.`;
      }
    }

    return `${message}. ${advice}`;
  };

  return (
    <div className="calendar-container">
      <h2>Weather Calendar</h2>
      
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter location (required)"
            value={newEvent.location}
            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
            required
          />
        </div>
        <div className="form-group event-type">
          <label className="radio-label">
            <input
              type="radio"
              name="eventType"
              checked={!newEvent.isOutdoor}
              onChange={() => setNewEvent({...newEvent, isOutdoor: false})}
            />
            <span>Indoor Event</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="eventType"
              checked={newEvent.isOutdoor}
              onChange={() => setNewEvent({...newEvent, isOutdoor: true})}
            />
            <span>Outdoor Event</span>
          </label>
        </div>
        <button type="submit" className="add-event-btn">Add Event</button>
      </form>

      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <button 
                onClick={() => deleteEvent(event.id)}
                className="delete-event-btn"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <p className="event-time">
              {format(new Date(`${event.date}T${event.time}`), 'PPpp')}
            </p>
            <p className="event-location">{event.location || currentLocation?.name}</p>
            <div className="weather-forecast">
              <img 
                src={`https://openweathermap.org/img/wn/${event.weather.icon}.png`}
                alt="Weather icon"
              />
              <p>{getWeatherMessage(event)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
