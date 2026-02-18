import Navbar from "./components/Navbar.jsx";
import Load from "./components/Load.jsx";

import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

import Messages from "./pages/Messages.jsx";
import Calls from "./pages/Calls.jsx";
import Request from "./pages/RequestMessages.jsx";
import Profile from "./pages/UserProfile.jsx";
import Login from "./pages/LoginPage.jsx";
import Signup from "./pages/SignupPage.jsx";

function App() {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <Load />
    );
  }

  return (
    <div className="flex h-screen gap-4">
      {authUser && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={ authUser ? <Messages /> : <Navigate to="/login" /> } />
          <Route path="/calls" element={ authUser ? <Calls /> : <Navigate to="/login" /> } />
          <Route path="/requests" element={ authUser ? <Request /> : <Navigate to="/login" /> } />
          <Route path="/profile" element={ authUser ? <Profile /> : <Navigate to="/login" /> } />
          <Route path="/login" element={ !authUser ? <Login /> : <Navigate to="/" /> } />
          <Route path="/signup" element={ !authUser ? <Signup /> : <Navigate to="/" /> } />
        </Routes>
      </div>
    </div>
  ) 
}
export default App