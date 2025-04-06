import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./css/Sidebar.css";
import { smoRoutes, ffmRoutes } from '../consts'
import { AuthContext } from "../hooks/user"
import { TranslationContext } from "../hooks/translation"
import LogoutIcon from "@mui/icons-material/Logout";

// This is the sidebar of the site
// If it's a FFM there will be displayed: dashboard, machines, reports, settings, logout
// If it's a SMO : dashboard sites, reports, settings, logout
// The choice is based on if the field .site is null in the context

function Sidebar() {
  const auth = useContext(AuthContext)
  const { translate } = useContext(TranslationContext)
  return (
    <div className="sidebar">
      <h2 className="d-flex fs-4 justify-content-start logo mx-3">Dash</h2>
      <ul className="sidebar-links">
        {
          auth ? (
          (auth.site === null ? smoRoutes : ffmRoutes).map((route) => (
            <li key={route.title}>
              <Link key={route.title} to={route.url}>
                {route.icon}
                {translate.SideBar[route.title]}
              </Link>
            </li>
          ))
          ) : (
              <Link to={'/logout'} className="mt-auto">
                <LogoutIcon className="sidebar-icon" />
                Logout
              </Link>
        )
        }
      </ul>
    </div>
  );
}

export default Sidebar;
