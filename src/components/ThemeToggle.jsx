import React from 'react'
import './ThemeToggle.css'

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <div className="theme-toggle">
      <button onClick={toggleTheme}>
        {isDark ? (
          <i className="fas fa-sun"></i>
        ) : (
          <i className="fas fa-moon"></i>
        )}
      </button>
    </div>
  )
}

export default ThemeToggle
