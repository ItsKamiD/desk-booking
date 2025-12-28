import { useEffect, useMemo, useState } from "react";
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
    <div style={{ padding: 16 }}>
      <h2>Shared Desks</h2>

      <DateRangeBar
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onRefresh={reload}
      />

      {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
      {loading ? <div style={{ marginTop: 12 }}>Loading…</div> : null}

      <div style={{ marginTop: 16 }}>
        <DeskGrid desks={desks} userId={userId} onChanged={reload} />
      </div>
    </div>
  );
}
