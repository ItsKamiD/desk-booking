import DeskCard from "./DeskCard";

export default function DeskGrid({ desks, userId, onChanged }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      {desks.map((desk) => (
        <DeskCard key={desk.id} desk={desk} userId={userId} onChanged={onChanged} />
      ))}
    </div>
  );
}
