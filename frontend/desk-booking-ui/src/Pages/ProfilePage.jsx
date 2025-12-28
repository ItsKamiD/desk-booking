import { useEffect, useState } from "react";
import { api } from "../Api/client";

export default function ProfilePage({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await api.getProfile(userId);
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load profile");
    }
  };

  useEffect(() => { load(); }, [userId]);

  if (error) return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;
  if (!data) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Profile</h2>
      <div><b>{data.firstName} {data.lastName}</b> (id={data.id})</div>

      <h3 style={{ marginTop: 16 }}>Current reservations</h3>
      <ul>
        {data.currentReservations?.map((r) => (
          <li key={r.id}>
            Desk {r.deskId} — {String(r.reservationDate).slice(0, 10)}
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 16 }}>Past reservations</h3>
      <ul>
        {data.pastReservations?.map((r) => (
          <li key={r.id}>
            Desk {r.deskId} — {String(r.reservationDate).slice(0, 10)}
          </li>
        ))}
      </ul>
    </div>
  );
}
