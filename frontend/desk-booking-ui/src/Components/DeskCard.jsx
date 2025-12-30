import { useState } from "react";
import ReserveModal from "./ReserveModal";
import CancelModal from "./CancelModal";

function statusStyles(status) {
  if (status === "Open") return "bg-emerald-50 border-emerald-200 text-emerald-800";
  if (status === "Reserved") return "bg-rose-50 border-rose-200 text-rose-800";
  if (status === "Maintenance") return "bg-slate-100 border-slate-200 text-slate-700";
  return "bg-white border-slate-200 text-slate-700";
}

export default function DeskCard({ desk, userId, onChanged, day }) {
  const [showReserve, setShowReserve] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const status = desk.status;
  const reservedBy = desk.reservedBy;
  const reservation = desk.reservation;
  const isMine = reservedBy?.userId === userId;

  let hoverText = "";
  if (status === "Maintenance") hoverText = desk.maintenanceMessage || "Under maintenance";
  if (status === "Reserved" && reservedBy) hoverText = `Reserved by ${reservedBy.firstName} ${reservedBy.lastName}`;

  return (
    <div
      title={hoverText}
      className={`rounded-xl border p-4 shadow-sm ${statusStyles(status)} flex flex-col`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Desk #{desk.deskNumber}</div>
          <div className="mt-1 text-sm">
            <span className="font-medium">Status:</span> {status}
          </div>
        </div>

        <span className="rounded-full bg-white/70 px-2 py-1 text-xs font-semibold border border-white/50">
          {status}
        </span>
      </div>

      <div className="mt-4">
        {status === "Open" && (
          <button
            onClick={() => setShowReserve(true)}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reserve
          </button>
        )}

        {status === "Reserved" && isMine && reservation?.id && (
          <button
            onClick={() => setShowCancel(true)}
            className="w-full rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-black hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            Cancel
          </button>
        )}
      </div>

      {showReserve && (
        <ReserveModal
          deskId={desk.id}
          userId={userId}
          day={day}
          onClose={() => setShowReserve(false)}
          onDone={() => { setShowReserve(false); onChanged(); }}
        />
      )}

      {showCancel && reservation?.id && (
        <CancelModal
          reservationId={reservation.id}
          userId={userId}
          day={day}
          onClose={() => setShowCancel(false)}
          onDone={() => { setShowCancel(false); onChanged(); }}
        />
      )}
    </div>
  );
}
