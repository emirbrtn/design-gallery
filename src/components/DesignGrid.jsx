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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
      {items.map((design, index) => (
        <DesignCard key={design.id} design={design} index={index} />
      ))}
    </div>
  );
}
