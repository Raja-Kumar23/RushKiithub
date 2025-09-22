import React from 'react';
import './styles.css';

const YearTabs = ({ currentYear, setCurrentYear, loadTeachers, userRollNumber }) => {
  const yearTabs = [
    { code: "2", label: "2nd Year", semester: "3rd Sem" },
    { code: "21", label: "2nd Year", semester: "4th Sem" },
    { code: "3", label: "3rd Year", semester: "5th Sem" },
    { code: "31", label: "3rd Year", semester: "6th Sem" }
  ];

  const handleTabClick = (yearCode) => {
    if (yearCode !== currentYear) {
      setCurrentYear(yearCode);
      loadTeachers(yearCode);
    }
  };

  return (
    <div className="year-tabs-container">
      <div className="year-tabs-header">
        <h2>Select Academic Year & Semester</h2>
        <p>Choose your current academic semester to view faculty reviews</p>
      </div>
      
      <div className="year-tabs">
        {yearTabs.map(tab => (
          <button
            key={tab.code}
            className={`year-tab ${currentYear === tab.code ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.code)}
          >
            <div className="tab-content">
              <div className="tab-year">{tab.label}</div>
              <div className="tab-semester">{tab.semester}</div>
            </div>
            <div className="tab-indicator"></div>
          </button>
        ))}
      </div>
      
      <div className="tabs-info">
        <div className="info-card">
          <div className="info-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="info-text">
            <span className="info-title">Pro Tip</span>
            <span className="info-description">
              Switch between semesters to compare faculty across different terms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearTabs;