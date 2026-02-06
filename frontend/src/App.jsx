import Navbar from "./components/Navbar.jsx";

import { Route, Routes } from "react-router-dom";
import useAuthStore from "./store/useAuthStore.js";

import Messages from "./pages/Messages.jsx";
import Calls from "./pages/Calls.jsx";
import Request from "./pages/RequestMessages.jsx";
import Profile from "./pages/UserProfile.jsx";


function App() {

  const { authUser } = useAuthStore();

  return (
    <div className="flex h-screen gap-4 p-4">
      <Navbar />
      <Routes>
        <Route path="/" element={<Messages />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/requests" element={<Request />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  ) 
}
export default App