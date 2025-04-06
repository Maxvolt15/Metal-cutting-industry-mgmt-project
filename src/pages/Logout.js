import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token from sessionStorage
    sessionStorage.removeItem("token");
    setToken(null); // Reset app state
    navigate("/login"); // Redirect to login page
  }, [setToken, navigate]);

  return null; // No UI needed
};

export default Logout;