import { useState } from "react";
import ReserveModal from "./ReserveModal";
import CancelModal from "./CancelModal";

function statusColor(status) {
  if (status === "Open") return "#d1fae5";        // green-ish
  if (status === "Reserved") return "#fee2e2";    // red-ish
  if (status === "Maintenance") return "#e5e7eb"; // gray-ish
  return "#ffffff";
}

export default function DeskCard({ desk, userId, onChanged }) {
  const [showReserve, setShowReserve] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const status = desk.status;
  const reservedBy = desk.reservedBy;
  const reservation = desk.reservation;

  const isMine = reservedBy?.userId === userId;

  let hoverText = "";
  if (status === "Maintenance") hoverText = desk.maintenanceMessage || "Under maintenance";
  if (status === "Reserved" && reservedBy)
    hoverText = `Reserved by ${reservedBy.firstName} ${reservedBy.lastName}`;

  return (
    <div
      title={hoverText}
      style={{
        padding: 12,
        borderRadius: 10,
        border: "1px solid #ddd",
        background: statusColor(status),
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ fontWeight: 700 }}>Desk #{desk.deskNumber}</div>
      <div>Status: {status}</div>

      {status === "Open" && (
        <button onClick={() => setShowReserve(true)}>Reserve</button>
      )}

      {status === "Reserved" && isMine && reservation?.id && (
        <button onClick={() => setShowCancel(true)}>Cancel</button>
      )}

      {showReserve && (
        <ReserveModal
          deskId={desk.id}
          userId={userId}
          onClose={() => setShowReserve(false)}
          onDone={() => { setShowReserve(false); onChanged(); }}
        />
      )}

      {showCancel && reservation?.id && (
        <CancelModal
          reservationId={reservation.id}
          userId={userId}
          onClose={() => setShowCancel(false)}
          onDone={() => { setShowCancel(false); onChanged(); }}
        />
      )}
    </div>
  );
}
