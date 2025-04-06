import React, { useContext, useState } from "react";
import "./css/Settings.css";
import { TranslationContext } from '../hooks/translation'
// Simple setting page, mockup of future settings page

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { translate } = useContext(TranslationContext)
  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <h2>{translate.Settings.settings}</h2>
        <ul>
          
          <li onClick={() => setActiveTab("account")}>{translate.Settings.account}</li>
          <li onClick={() => setActiveTab("notifications")}>{translate.Settings.notifications}</li>
          <li onClick={() => setActiveTab("connected")}>{translate.Settings.devices_header}</li>
          <li onClick={() => setActiveTab("privacy")}>{translate.Settings.language}</li>
          <li onClick={() => setActiveTab("access")}>{translate.Settings.accessibility}</li>
          <li onClick={() => setActiveTab("help")}>{translate.Settings.help}</li>
        </ul>
      </div>
      <div className="settings-content">
        {activeTab === "notifications" && (
          <div>
            <h3>{translate.Settings.notifications_header}</h3>
            <p>{translate.Settings.notifications_text}</p>
            {/* Add form for profile updates */}
          </div>
        )}
        {activeTab === "account" && (
          <div>
            <h3>{translate.Settings.account_header}</h3>
            <p>{translate.Settings.account_text}</p>
            {/* Add form for account settings */}
          </div>
        )}
        {activeTab === "connected" && (
          <div>
            <h3>{translate.Settings.devices_header}</h3>
            <p>{translate.Settings.devices_text}</p>
            {/* Add options for preferences */}
          </div>
        )}
        {activeTab === "privacy" && (
          <div>
            <h3>{translate.Settings.language_header}</h3>
            <p>{translate.Settings.language_text}</p>
            {/* Add privacy-related settings */}
          </div>
        )}
        {activeTab === "access" && (
          <div>
            <h3>{translate.Settings.accessibility_header}</h3>
            <p>{translate.Settings.accessibility_text}</p>
            {/* Add privacy-related settings */}
          </div>
        )}
        {activeTab === "help" && (
          <div>
            <h3>{translate.Settings.help_header}</h3>
            <p>{translate.Settings.help_text}</p>
            {/* Add privacy-related settings */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;