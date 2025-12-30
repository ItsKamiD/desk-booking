import { Link } from "react-router-dom";
import UserPicker from "../components/UserPicker";

export default function Header({ userId, setUserId }) {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + title */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Desk Booking logo" className="h-9 w-9 object-contain" />
          <span className="text-xl font-bold text-indigo-600">Desk Booking</span>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 text-gray-600 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Desks</Link>
          <Link to="/profile" className="hover:text-indigo-600 transition">Profile</Link>
        </nav>

        {/* Current user (select) */}
        <div className="flex items-center gap-2">
          <UserPicker userId={userId} setUserId={setUserId} />
        </div>
      </div>
    </header>
  );
}
