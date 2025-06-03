import React from 'react';
import './History.css';

const History = ({ history, onDelete, onDeleteAll, onLocationSelect }) => {
  if (!history.length) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h2>Search History</h2>
        </div>
        <p className="no-history">No search history yet</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Search History</h2>
        <button onClick={onDeleteAll} className="delete-all-btn">
          Clear All
        </button>
      </div>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="location-info" onClick={() => onLocationSelect(item)}>
              <h3>{item.name}</h3>
              <p>{item.temperature}°C - {item.weather}</p>
              <small>{new Date(item.timestamp).toLocaleString()}</small>
            </div>
            <button 
              onClick={() => onDelete(item.id)} 
              className="delete-btn"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
