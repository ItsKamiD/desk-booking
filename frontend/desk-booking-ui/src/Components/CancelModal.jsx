import { useState } from "react";
import { api } from "../Api/client";

export default function CancelModal({ reservationId, userId, onClose, onDone }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    setBusy(true);
    setError("");

    // empty => null, otherwise must be a number
    const trimmed = code.trim();
    const accessCode =
      trimmed === "" ? null : Number.isFinite(Number(trimmed)) ? Number(trimmed) : NaN;

    if (accessCode !== null && Number.isNaN(accessCode)) {
      setBusy(false);
      setError("Access code must be a number.");
      return;
    }

    try {
      await api.cancelReservation(reservationId, userId, accessCode);
      onDone();
    } catch (e) {
      setError(e.message || "Cancel failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Cancel reservation #{reservationId}</h3>

        <div style={{ fontSize: 13 }}>
          Enter your access code to cancel this reservation.
        </div>

        <label>
          Access code:
          <input
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 123456"
          />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <button disabled={busy} onClick={cancel}>
            {busy ? "Cancelling…" : "Cancel reservation"}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "white",
  padding: 16,
  borderRadius: 10,
  width: 360,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
