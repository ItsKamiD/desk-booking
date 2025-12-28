export default function UserPicker({ userId, setUserId }) {
  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      Current user:
      <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
        <option value={1}>Kami Demo (id=1)</option>
        <option value={2}>Alex Smith (id=2)</option>
      </select>
    </label>
  );
}
