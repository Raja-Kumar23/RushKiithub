"use client"
import { User, LogOut, Sun, Moon, Calendar, ChevronDown } from "lucide-react"
import Link from "next/link" // Import Link from next/link
// Removed useRouter as it's not needed here for direct Link navigation
import "./ProfileSection.css"

const ProfileSection = ({
user,
showProfileDropdown,
setShowProfileDropdown,
handleSignOut,
handleGoogleSignIn,
theme,
isDarkMode,
toggleTheme,
}) => {
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
color: theme.textPrimary,
}}
>
<img src={user.photoURL || "/default-profile.png"} alt="Profile" className="profile-image" />
<span className="profile-name">{user.displayName?.split(" ")[0]}</span>
<ChevronDown size={16} className="chevron-icon" />
</button>
{showProfileDropdown && (
<div
className="profile-dropdown"
style={{
background: theme.cardBg,
borderColor: theme.border,
boxShadow: theme.shadow,
}}
>
<div className="profile-info">
<img
src={user.photoURL || "/placeholder.svg?height=60&width=60"} // Using placeholder.svg
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
<Link
href="/timetable"
target="_blank"
rel="noopener noreferrer"
style={{ color: theme.textPrimary }}
onClick={() => setShowProfileDropdown(false)} // Optional
className="profile-action timetable"
>
<Calendar size={18} />
My Timetable
</Link>
{/* Theme Toggle - Now inside the dropdown */}
<button
className="profile-action theme-toggle"
onClick={toggleTheme}
style={{ color: theme.textPrimary }}
>
{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
{isDarkMode ? "Light Mode" : "Dark Mode"}
</button>
<button className="profile-action logout" onClick={handleSignOut} style={{ color: theme.error }}>
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
boxShadow: theme.shadow,
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