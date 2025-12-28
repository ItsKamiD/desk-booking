export default function DateRangeBar({ startDate, endDate, setStartDate, setEndDate, onRefresh }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <label>
        Start:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label>
        End:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}
