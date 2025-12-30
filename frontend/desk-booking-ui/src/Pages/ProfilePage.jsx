import { useEffect, useState } from "react";
import { api } from "../Api/client";

function formatDay(d) {
  return String(d).slice(0, 10);
}

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

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }
  if (!data) return <div className="text-slate-600">Loading…</div>;

  const Section = ({ title, items }) => (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {items?.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2">
              <span className="text-sm text-slate-800">Desk {r.deskId}</span>
              <span className="text-sm text-slate-500">{formatDay(r.reservationDate)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-2 text-sm text-slate-500">No reservations.</div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <div className="mt-2 text-slate-700">
          <span className="font-semibold">{data.firstName} {data.lastName}</span>{" "}
          <span className="text-slate-500">(id={data.id})</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Current reservations" items={data.currentReservations} />
        <Section title="Past reservations" items={data.pastReservations} />
      </div>
    </div>
  );
}
