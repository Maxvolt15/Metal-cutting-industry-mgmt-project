import React, { useState, useContext, useRef } from "react";
import "./css/Topbar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AuthContext } from "../hooks/user";
import UserThumbnail from "./UserThumbnail";
import ChangeTranslation from "./changeTranslation";

function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const notifications = ["Allert #1", "Allert #2", "Allert #3"];
  const ref = useRef(null)

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const auth = useContext(AuthContext);
  return (
    <div className="topbar w-100  px-3">
      <div className="ms-auto d-flex align-items-center gap-2 ">
        <ChangeTranslation
          className="notification-icon"
          show={showTranslation}
          setShow={setShowTranslation}
        />
        <div className="notification-wrapper">
          <NotificationsIcon
            className="notification-icon"
            onClick={toggleNotifications}
            ref={ref}
          />
          <div className="notification-dropdown" hidden={!showNotifications}>
            {notifications.length > 0 ? (
              notifications.map((message, index) => (
                <div key={index} className="notification-item">
                  {message}
                </div>
              ))
            ) : (
              <div className="notification-item">No new notifications</div>
            )}
          </div>
        </div>
        {auth ? (
          <UserThumbnail
            email={auth.email}
            name={auth.first_name}
            surname={auth.last_name}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Topbar;
