// import React, { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./firebaseconfig";
// import "./css/Login.css"; // Import the CSS file

// function Login({ setToken }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       const userCreds = await signInWithEmailAndPassword(auth, email, password);
//       const token = userCreds.user.accessToken;
//       setToken(token);
//       localStorage.setItem("token", token);
//       // alert("Login successful!");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <form onSubmit={handleLogin}>
//         <h1>Login</h1>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//         {error && <p>{error}</p>}
//       </form>
//     </div>
//   );
// }

// export default Login;




import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  const sanitizeInput = (input) => input.replace(/<[^>]*>?/gm, ""); // Sanitize input

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (loginAttempts >= 5) {
      setError("Too many login attempts. Please wait.");
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);

      const userCreds = await signInWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword);
      const token = userCreds.user.accessToken;

      localStorage.setItem("token", token); // Use localStorage for persistence
      setToken(token); // Update app state
      setLoginAttempts(0); // Reset login attempts
      console.log("Navigating to /dashboard");
      navigate("/dashboard");
    } catch (err) {
      setLoginAttempts((prev) => prev + 1); // Increment login attempts
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please check your email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default Login;

