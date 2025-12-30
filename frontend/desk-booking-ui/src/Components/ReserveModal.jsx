import { useState } from "react";
import { api } from "../Api/client";

export default function ReserveModal({ deskId, userId, day, onClose, onDone }) {
  const [selectedDay, setSelectedDay] = useState(day);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [accessCode, setAccessCode] = useState(null);

  const reserve = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await api.reserveDay(deskId, userId, day);
      const code = res?.reservation?.reservationAccessCode;
      setAccessCode(code ?? null);
    } catch (e) {
      setError(e.message || "Reserve failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Reserve desk #{deskId}</h3>

        <label>
          Day:
          <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        {accessCode ? (
          <>
            <div style={{ marginTop: 8 }}>
              ✅ Reserved. Your access code: <b>{accessCode}</b>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={onDone}>Close</button>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button disabled={busy} onClick={reserve}>
              {busy ? "Reserving…" : "Reserve"}
            </button>
            <button onClick={onClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
  display: "flex", alignItems: "center", justifyContent: "center"
};

const modal = {
  background: "white", padding: 16, borderRadius: 10, width: 360,
  display: "flex", flexDirection: "column", gap: 10
};
