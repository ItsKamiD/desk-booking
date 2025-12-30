import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./Components/Header";
import DesksPage from "./pages/DesksPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [userId, setUserId] = useState(1);

  return (
    <BrowserRouter>
      <Header userId={userId} setUserId={setUserId} />

      {/* MAIN LAYOUT WRAPPER */}
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <Routes>
            <Route path="/" element={<DesksPage userId={userId} />} />
            <Route path="/profile" element={<ProfilePage userId={userId} />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}
