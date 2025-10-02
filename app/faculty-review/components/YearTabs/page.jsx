"use client";

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
      
      
    </div>
  );
};

export default YearTabs;