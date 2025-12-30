import { useEffect, useState } from "react";
import { api } from "../Api/client";
import DeskGrid from "../Components/DeskGrid";
import DateRangeBar from "../Components/DateRangeBar";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function DesksPage({ userId }) {
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getDesksRange(startDate, endDate);
      setDesks(data);
    } catch (e) {
      setError(e.message || "Failed to load desks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [startDate, endDate]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Reserve a desk
        </h1>
        <p className="text-sm text-slate-600">
          Select a date to see available desks and make a reservation.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <DateRangeBar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onRefresh={reload}
        />

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && <div className="mt-3 text-sm text-slate-600">Loading…</div>}
      </div>

      <DeskGrid desks={desks} userId={userId} onChanged={reload} />
    </div>
  );
}
