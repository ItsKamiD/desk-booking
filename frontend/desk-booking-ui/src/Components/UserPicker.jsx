export default function UserPicker({ userId, setUserId }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <span className="whitespace-nowrap">Current user:</span>
      <select
        className="border rounded-md px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
      >
        <option value={1}>Kami Demo</option>
        <option value={2}>Alex Smith</option>
      </select>
    </label>
  );
}
