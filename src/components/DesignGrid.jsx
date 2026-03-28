import DesignCard from "./DesignCard";

export default function DesignGrid({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center text-neutral-500 shadow-sm">
        Bu kategoride henüz tasarım yok.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </div>
  );
}
