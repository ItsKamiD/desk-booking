import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./Components/Header";
import DesksPage from "./pages/DesksPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [userId, setUserId] = useState(1);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Header userId={userId} setUserId={setUserId} />

        <main className="mx-auto max-w-5xl px-6 py-6">
          <Routes>
            <Route path="/" element={<DesksPage userId={userId} />} />
            <Route path="/profile" element={<ProfilePage userId={userId} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
