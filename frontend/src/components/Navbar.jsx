import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import AccountSettings from "./AccountSettings";

// Read all user data from localStorage in one shot
const readUserData = () => ({
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  userName: localStorage.getItem("userName") || "",
  userEmail: localStorage.getItem("userEmail") || "",
});

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(readUserData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Re-read localStorage immediately whenever route changes OR userDataUpdated fires
  const refresh = useCallback(() => setUserData(readUserData()), []);

  useEffect(() => {
    refresh();
  }, [location, refresh]);

  useEffect(() => {
    window.addEventListener("userDataUpdated", refresh);
    return () => window.removeEventListener("userDataUpdated", refresh);
  }, [refresh]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isPremium");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userAddress");
    setUserData({ isLoggedIn: false, userName: "", userEmail: "" });
    setShowSettings(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  // Avatar: first letter of name if available, otherwise email, otherwise "U"
  const displayName = userData.userName || userData.userEmail;
  const avatarLetter = displayName ? displayName[0].toUpperCase() : "U";

  return (
    <>
      <nav className="modern-navbar">
        <Link to="/" className="navbar-brand">
          <span>Resume</span> Insights
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
          <ul className="navbar-nav">
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === "/" || location.pathname === "/home" ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/upload"
                className={`nav-link ${location.pathname === "/upload" ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                ATS Score
              </Link>
            </li>
            <li>
              <a
                href="/#contact"
                onClick={(e) => {
                  handleContactClick(e);
                  setIsMenuOpen(false);
                }}
                className="nav-link"
              >
                Contact Us
              </a>
            </li>
          </ul>

          <div className="navbar-actions">
            <Link
              to="/payment"
              className={`nav-link ${location.pathname === "/payment" ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Upgrade Plans
            </Link>

            {userData.isLoggedIn ? (
              <>
                <button
                  className="profile-btn"
                  onClick={() => {
                    setShowSettings(true);
                    setIsMenuOpen(false);
                  }}
                  aria-label="Account Settings"
                >
                  <span className="profile-avatar">{avatarLetter}</span>
                  <span className="profile-label">
                    {userData.userName
                      ? userData.userName.split(" ")[0] // first name only
                      : "Profile"}
                  </span>
                  <span className="profile-chevron">⚙</span>
                </button>
                <button
                  className="action-btn logout-btn"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="action-btn login-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Account Settings Modal */}
      {showSettings && (
        <AccountSettings
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
          initialEmail={userData.userEmail}
          initialName={userData.userName}
        />
      )}
    </>
  );
};

export default Navbar;
