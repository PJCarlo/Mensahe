import Navbar from "./components/Navbar";

import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

import Messages from "./pages/Messages";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  
  return (
    <div>
      
      <Navbar />

      <Routes>
        <Route path="/messages" element={<Messages />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

    </div>
  )
}

export default App
