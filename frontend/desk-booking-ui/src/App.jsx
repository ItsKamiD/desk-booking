import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import DesksPage from "./pages/DesksPage";
import ProfilePage from "./pages/ProfilePage";
import UserPicker from "./components/UserPicker";

export default function App() {
  const [userId, setUserId] = useState(1);

  return (
    <BrowserRouter>
      <div style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Desks</Link>
        <Link to="/profile">Profile</Link>
        <div style={{ marginLeft: "auto" }}>
          <UserPicker userId={userId} setUserId={setUserId} />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<DesksPage userId={userId} />} />
        <Route path="/profile" element={<ProfilePage userId={userId} />} />
      </Routes>
    </BrowserRouter>
  );
}
