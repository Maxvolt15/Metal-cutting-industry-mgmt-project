import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./pages/css/App.css";
import { AuthContext } from "./hooks/user";
import Sidebar from "./components/SideBar";
import Topbar from "./components/Topbar";
import Login from "./pages/Login";
import MyRoutes from "./components/Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { TranslationProvider } from "./hooks/translation";

const baseUrl = "https://api-656930476914.europe-west1.run.app/api/v1.0";

function App() {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Memoized context value for optimized rendering
  const contextValue = useMemo(() => currentUser, [currentUser]);

  /**
   * Function to validate the token using a backend API
   */
  async function checkTokenValidity(token) {
    try {
      const response = await fetch(`${baseUrl}/validate-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Token validation failed:", response.statusText);
        return false;
      }

      const data = await response.json();
      return data.isValid; // Assuming API response includes { isValid: true/false }
    } catch (error) {
      console.error("Error during token validation:", error);
      return false;
    }
  }

  /**
   * useEffect to validate token on app mount
   */
  useEffect(() => {
    async function validateToken() {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const isValid = await checkTokenValidity(storedToken);
          if (isValid) {
            setToken(storedToken);
          } else {
            localStorage.removeItem("token");
            setToken(null);
          }
        } catch (error) {
          console.error("Error validating token:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    }

    validateToken();
  }, []);

  /**
   * useEffect to fetch user data when the token is available
   */
  useEffect(() => {
    async function getUser() {
      if (!token) return;

      try {
        const response = await fetch(`${baseUrl}/user/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.data);
        } else if (response.status === 401) {
          console.warn("Token expired or invalid. Logging out...");
          localStorage.removeItem("token");
          setToken(null);
          setCurrentUser(null);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    getUser();
  }, [token]);

  return (
    <TranslationProvider>
      <AuthContext.Provider value={contextValue}>
        <Router>
          <div className="app d-flex overflow-hidden flex-shrink-0">
            {token ? (
              <div className="d-flex w-100 flex-shrink-0 overflow-hidden">
                <div className="d-flex">
                  <Sidebar />
                </div>
                <div className="content overflow-hidden flex-1">
                  <Topbar />
                  <div className="home-container w-100 h-100 pb-4">
                    <MyRoutes setToken={setToken} />
                  </div>
                </div>
              </div>
            ) : (
              <Routes>
                <Route path="*" element={<Login setToken={setToken} />} />
              </Routes>
            )}
          </div>
        </Router>
      </AuthContext.Provider>
    </TranslationProvider>
  );
}

export default App;
