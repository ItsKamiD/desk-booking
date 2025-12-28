async function http(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      msg = body?.message || JSON.stringify(body) || msg;
    } catch {}
    throw new Error(msg);
  }

  // some endpoints may return empty body
  try { return await res.json(); } catch { return null; }
}

export const api = {
  getDesksRange: (startDate, endDate) =>
    http(`/api/desks/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),

  reserveDay: (deskId, userId, day) =>
    http(`/api/reservations/reserve-day`, {
      method: 'POST',
      body: JSON.stringify({ deskId, userId, day }),
    }),

  cancelReservation: (reservationId, userId, reservationAccessCode) =>
    http(`/api/reservations/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reservationId, userId, reservationAccessCode }),
    }),

  getProfile: (userId) =>
    http(`/api/reservations/profile/${userId}`),
};
