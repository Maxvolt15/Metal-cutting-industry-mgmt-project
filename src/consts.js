import LocationOnIcon from "@mui/icons-material/LocationOn";
import BuildIcon from "@mui/icons-material/Build";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";


// This file allows to have 2 different sidebars based on which user is logged in: the ffm or the smo

const smoRoutes = [
    {
        url: "/",
        title: "Dashboard",
        icon: <DashboardIcon className="sidebar-icon" />
    },
    {
        url: "/sites",
        title: "Sites",
        icon: <LocationOnIcon className="sidebar-icon" />

    },
    {
        url: "/report",
        title: "Report",
        icon: <HistoryIcon className="sidebar-icon" />
      
    },
    {
        url: "/settings",
        title: "Settings",
        icon: <SettingsIcon className="sidebar-icon" />
      
    },
    {
      url: "/logout",
        title: "Logout",
        icon: <LogoutIcon className="sidebar-icon" />
      
    }
  ]
const ffmRoutes = [
    {
        url: "/",
        title: "Dashboard",
        icon: <DashboardIcon className="sidebar-icon" />
    },
    {
        url: "/machines",
        title: "Machines",
        icon: <BuildIcon className="sidebar-icon" />
    },
    {
        url: "/report",
        title: "Report",
        icon: <HistoryIcon className="sidebar-icon" />
    },
    {
        url: "/settings",
        title: "Settings",
        icon: <SettingsIcon className="sidebar-icon" />
    },
    {
      url: "/logout",
        title: "Logout",
        icon: <LogoutIcon className="sidebar-icon" /> 
    }
]
export {
    smoRoutes,
    ffmRoutes
}