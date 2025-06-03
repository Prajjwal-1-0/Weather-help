import React from 'react'
import './Sidebar.css'

const Sidebar = ({ activeTab, onTabChange }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <div 
          className={`menu-item ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => onTabChange('weather')}
        >
          <i className="fas fa-home"></i>
          <span>Weather</span>
        </div>
        <div 
          className={`menu-item ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => onTabChange('locations')}
        >
          <i className="fas fa-map-marker-alt"></i>
          <span>Locations</span>
        </div>
        <div 
          className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => onTabChange('history')}
        >
          <i className="fas fa-history"></i>
          <span>History</span>
        </div>          <div 
          className={`menu-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => onTabChange('calendar')}
        >
          <i className="fas fa-calendar-alt"></i>
          <span>Calendar</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
