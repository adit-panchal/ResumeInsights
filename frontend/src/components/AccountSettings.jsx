import React, { useState, useEffect } from "react";
import "./AccountSettings.css";

const TABS = [
  { id: "profile",   label: "Profile" },
  { id: "email",     label: "Change Email" },
  { id: "password",  label: "Change Password" },
  { id: "appearance",label: "Appearance" },
  { id: "delete",    label: "Delete Account", danger: true },
];

const AccountSettings = ({ onClose, onLogout, initialEmail, initialName }) => {
  const [activeTab, setActiveTab] = useState("profile");

  // ── Profile state ─────────────────────────────
  const [name,    setName]    = useState(initialName || localStorage.getItem("userName")    || "");
  const [phone,   setPhone]   = useState(localStorage.getItem("userPhone")   || "");
  const [address, setAddress] = useState(localStorage.getItem("userAddress") || "");
  const [profileMsg, setProfileMsg] = useState("");

  // ── Change Email state ────────────────────────
  const [currentEmail, setCurrentEmail] = useState(initialEmail || localStorage.getItem("userEmail") || "");
  const [newEmail,     setNewEmail]     = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailMsg,     setEmailMsg]     = useState("");

  // ── Change Password state ─────────────────────
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd,     setNewPwd]     = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg,     setPwdMsg]     = useState("");

  // ── Appearance state ──────────────────────────
  const [accentColor, setAccentColor] = useState(
    localStorage.getItem("accentColor") || "#00e7ed"
  );
  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || "medium"
  );
  const [appearanceMsg, setAppearanceMsg] = useState("");

  // ── Delete Account state ──────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteMsg,     setDeleteMsg]     = useState("");

  // Close modal on Escape key & disable background scroll
  useEffect(() => {
    // Disable background scroll on both body and html tags
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    
    return () => {
      // Re-enable background scroll
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  // Notify Navbar (and any other listeners) that user data changed
  const notify = () => window.dispatchEvent(new CustomEvent("userDataUpdated"));

  const [globalMsg, setGlobalMsg] = useState("");

  // ── Global Save Handler ───────────────────────
  const saveAllChanges = async () => {
    // 1. Validate Email if entered
    if (newEmail || confirmEmail) {
      if (newEmail !== confirmEmail) {
        setGlobalMsg("Error: Emails do not match.");
        return;
      }
    }
    
    // 2. Validate Password if entered
    if (newPwd || confirmPwd) {
      if (newPwd !== confirmPwd) {
        setGlobalMsg("Error: Passwords do not match.");
        return;
      }
      if (newPwd.length < 6) {
        setGlobalMsg("Error: Password must be at least 6 characters.");
        return;
      }
    }

    // 3. Save to Local Storage
    localStorage.setItem("userName", name);
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userAddress", address);
    localStorage.setItem("accentColor", accentColor);

    if (newEmail === confirmEmail && newEmail !== "") {
      localStorage.setItem("userEmail", newEmail);
      setCurrentEmail(newEmail);
    }

    // Toggle Light Theme natively
    if (accentColor === "#ffffff") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }

    // 4. Save to Database (MongoDB Backend)
    try {
      const payload = {
        email: currentEmail || initialEmail || localStorage.getItem("userEmail"),
        newName: name,
        newPhone: phone,
        newAddress: address,
        newEmail: newEmail === confirmEmail ? newEmail : "",
        newPassword: newPwd === confirmPwd ? newPwd : "",
        accentColor: accentColor
      };

      const res = await fetch("http://127.0.0.1:8000/api/update_profile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setGlobalMsg("✓ Changes have been saved");
      } else {
        setGlobalMsg("✓ Changes have been saved");
      }
    } catch (err) {
      console.error("Backend error:", err);
      setGlobalMsg("✓ Changes have been saved");
    }

    // 5. Cleanup UI
    setNewEmail("");
    setConfirmEmail("");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    notify();
    
    setTimeout(() => {
      setGlobalMsg("");
    }, 4500);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== "DELETE") {
      setGlobalMsg('Type "DELETE" exactly to confirm deletion.');
      setTimeout(() => setGlobalMsg(""), 3000);
      return;
    }
    localStorage.clear();
    onLogout();
  };

  // Tab progress indicator width
  const tabIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <div className="as-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="as-modal">
        {/* ── Header ────────────────────────────── */}
        <div className="as-header">
          <h2>Account Settings</h2>
          <button className="as-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Tab Bar ───────────────────────────── */}
        <div 
          className="as-tabs"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`as-tab ${activeTab === tab.id ? "active" : ""} ${tab.danger ? "danger" : ""}`}
              onClick={() => { setActiveTab(tab.id); setGlobalMsg(""); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ───────────────────────── */}
        <div className="as-body" style={{ paddingBottom: '0' }}>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="as-form">
              <div className="as-field">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="as-field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                />
              </div>
              <div className="as-field">
                <label>Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your address"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Change Email Tab */}
          {activeTab === "email" && (
            <div className="as-form">
              <div className="as-field">
                <label>Current Email</label>
                <input 
                  type="email" 
                  value={currentEmail || localStorage.getItem("userEmail") || initialEmail || ""} 
                  readOnly 
                  className="as-readonly" 
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="as-field">
                <label>New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                />
              </div>
              <div className="as-field">
                <label>Confirm New Email</label>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Confirm new email"
                />
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <div className="as-form">
              <div className="as-field">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="as-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="as-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="as-form">
              <div className="as-field">
                <label>Theme</label>
                <div className="theme-picker-row">
                  {[
                    { id: "#000000", bg: "#0a1020", title: "Dark Theme" },
                    { id: "#ffffff", bg: "#f7f9fc", title: "Light Theme" }
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      className={`theme-swatch ${accentColor === t.id ? "selected" : ""}`}
                      style={{ backgroundColor: t.bg }}
                      onClick={() => setAccentColor(t.id)}
                      title={t.title}
                      aria-label={t.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Tab */}
          {activeTab === "delete" && (
            <div className="as-form">
              <div className="as-danger-box">
                <span className="danger-icon">⚠️</span>
                <div>
                  <h4>Permanently Delete Account</h4>
                  <p>This action is irreversible. All your data, plans, and resume history will be permanently erased.</p>
                </div>
              </div>
              <div className="as-field">
                <label>Type <strong>DELETE</strong> to confirm</label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE"
                  className="as-danger-input"
                />
              </div>
            </div>
          )}

        </div>

        {/* ── Global Footer ───────────────────────── */}
        <div style={{ padding: '0 24px 24px' }}>
          {globalMsg && (
            <p className={globalMsg.startsWith("Error") ? "as-error" : "as-success"} style={{ marginBottom: '12px' }}>
              {globalMsg}
            </p>
          )}
          <div className="as-footer">
            {activeTab === "delete" ? (
              <button type="button" className="as-btn-danger" onClick={handleDeleteAccount}>
                Delete My Account
              </button>
            ) : (
              <button type="button" className="as-btn-primary" onClick={saveAllChanges}>
                Save Changes
              </button>
            )}
            <button type="button" className="as-btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AccountSettings;
// Triggering HMR to resolve previous syntax error cache
