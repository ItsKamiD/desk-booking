import DeskCard from "./DeskCard";

export default function DeskGrid({ desks, userId, onChanged }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {desks.map((desk) => (
        <DeskCard key={desk.id} desk={desk} userId={userId} onChanged={onChanged} />
      ))}
    </div>
  );
}
