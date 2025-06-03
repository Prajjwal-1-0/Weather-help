import { useState, useEffect } from 'react'
import Weather, { allIcons } from './components/Weather'
import Sidebar from './components/Sidebar'
import ThemeToggle from './components/ThemeToggle'
import MapView from './components/MapView'
import History from './components/History'
import Calendar from './components/Calendar'
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [activeTab, setActiveTab] = useState('weather')
  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem('currentLocation')
    return saved ? JSON.parse(saved) : null
  })
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('weatherSearchHistory')
    return saved ? JSON.parse(saved) : []
  })

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.body.setAttribute('data-theme', newTheme ? 'dark' : 'light')
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const handleLocationUpdate = (location) => {
    if (location && location.coord) {
      const newLocation = {
        name: location.name, // City name
        displayName: location.name.charAt(0).toUpperCase() + location.name.slice(1), // Capitalized city name
        coordinates: [location.coord.lat, location.coord.lon],
        temperature: Math.floor(location.main.temp),
        weather: location.weather[0].main,
        humidity: location.main.humidity,
        windSpeed: Math.round(location.wind.speed * 3.6),
        icon: allIcons[location.weather[0].icon] || allIcons["01d"],
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      setCurrentLocation(newLocation);
      setSearchHistory(prev => [newLocation, ...prev]);
    }
  }

  const handleDeleteHistory = (id) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteAllHistory = () => {
    setSearchHistory([]);
  };

  const handleHistorySelect = (location) => {
    setCurrentLocation(location);
    setActiveTab('locations');
  };

  useEffect(() => {
    // Set initial theme based on isDark state
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  // Load search history from localStorage on initial load
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Save current location to localStorage whenever it changes
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem('currentLocation', JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        {activeTab === 'weather' ? (
          <Weather 
            onLocationUpdate={handleLocationUpdate}
            currentLocation={currentLocation}
          />
        ) : activeTab === 'locations' ? (
          <MapView location={currentLocation} />
        ) : activeTab === 'history' ? (
          <History 
            history={searchHistory}
            onDelete={handleDeleteHistory}
            onDeleteAll={handleDeleteAllHistory}
            onLocationSelect={handleHistorySelect}
          />
        ) : activeTab === 'calendar' ? (
          <Calendar currentLocation={currentLocation} />
        ) : null}
      </main>
    </div>
  )
}

export default App
