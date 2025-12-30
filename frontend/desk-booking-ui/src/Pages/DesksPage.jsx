import { useEffect, useState } from "react";
import { api } from "../Api/client";
import DeskGrid from "../Components/DeskGrid";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function DesksPage({ userId }) {
  const [day, setDay] = useState(todayISO());
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      // we keep the same backend endpoint but send the same day twice
      const data = await api.getDesksRange(day, day);
      setDesks(data);
    } catch (e) {
      setError(e.message || "Failed to load desks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [day]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Reserve a desk</h1>
        <p className="text-sm text-slate-600">
          Select a day to see availability and make a reservation.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Day
            </label>
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
          </div>

          <button
            onClick={reload}
            className="rounded-lg border bg-slate-50 px-4 py-2 shadow-sm hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && <div className="mt-3 text-sm text-slate-600">Loading…</div>}
      </div>

      {/* pass selected day so ReserveModal can default to it */}
      <DeskGrid desks={desks} userId={userId} day={day} onChanged={reload} />
    </div>
  );
}
