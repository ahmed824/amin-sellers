import React from 'react';

const BottomNavItem = ({ 
  icon, 
  label, 
  isSelected, 
  onClick, 
  value 
}) => {
  return (
    <div
      className={`bottom-nav-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(value)}
    >
      <div className="nav-content">
        <div className="icon-container">
          <div className="icon-wrapper">
            {icon}
          </div>
          {isSelected && <div className="icon-glow" />}
        </div>
        
        <span className="nav-label">
          {label}
        </span>
      </div>
      
      {/* Modern selection indicators */}
      <div className="selection-indicators">
        <div className="bottom-indicator" />
        <div className="background-glow" />
      </div>
      
      {/* Ripple effect container */}
      <div className="ripple-container" />
    </div>
  );
};

export default BottomNavItem;