export default function DateBar({ day, setDay, onRefresh }) {
  return (
    <div className="border rounded-xl p-4 flex items-end gap-4 bg-white shadow-sm">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Day</label>
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      <button
        onClick={onRefresh}
        className="ml-auto px-4 py-2 rounded-lg bg-gray-50 border hover:bg-gray-100"
      >
        Refresh
      </button>
    </div>
  );
}
