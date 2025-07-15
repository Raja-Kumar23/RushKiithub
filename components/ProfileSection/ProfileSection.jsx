import React from 'react'
import { User, LogOut, UserCircle, Sun, Moon, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import './ProfileSection.css'

const ProfileSection = ({ 
  user, 
  showProfileDropdown, 
  setShowProfileDropdown, 
  handleSignOut, 
  handleGoogleSignIn, 
  theme,
  isDarkMode,
  toggleTheme
}) => {
  const router = useRouter()
  
  const handleTimetableClick = () => {
    setShowProfileDropdown(false)
    router.push('/timetable')
  }

  return (
    <div className="profile-section">
      {/* Profile Section */}
      {user ? (
        <div className="profile-container">
          <button
            className="profile-button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              background: theme.glassBg,
              borderColor: theme.border,
              boxShadow: theme.shadow,
              color: theme.textPrimary
            }}
          >
            <img
              src={user.photoURL || "/default-profile.png"}
              alt="Profile"
              className="profile-image"
            />
            <span className="profile-name">
              {user.displayName?.split(' ')[0]}
            </span>
          </button>

          {showProfileDropdown && (
            <div 
              className="profile-dropdown"
              style={{
                background: theme.cardBg,
                borderColor: theme.border,
                boxShadow: theme.shadow
              }}
            >
              <div className="profile-info">
                <img
                  src={user.photoURL || "/default-profile.png"}
                  alt="Profile"
                  className="dropdown-image"
                />
                <div className="user-details">
                  <p className="user-name" style={{ color: theme.textPrimary }}>
                    {user.displayName}
                  </p>
                  <p className="user-email" style={{ color: theme.textMuted }}>
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="profile-divider" style={{ background: theme.border }}></div>
              
              <div className="profile-actions">
                <button 
                  className="profile-action timetable"
                  onClick={handleTimetableClick}
                  style={{ color: theme.textPrimary }}
                >
                  <Calendar size={18} />
                  My Timetable
                </button>
                
                {/* Theme Toggle - Now inside the dropdown */}
                <button 
                  className="profile-action theme-toggle"
                  onClick={toggleTheme}
                  style={{ color: theme.textPrimary }}
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                
                <button 
                  className="profile-action logout"
                  onClick={handleSignOut}
                  style={{ color: theme.error }}
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          className="login-button"
          onClick={handleGoogleSignIn}
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            boxShadow: theme.shadow
          }}
        >
          <User size={20} />
          Sign In
        </button>
      )}
    </div>
  )
}

export default ProfileSection