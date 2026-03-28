"use client";

export default function ImageModal({ image, title, isOpen, onClose }) {
  if (!isOpen || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black shadow"
        >
          Kapat
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <img
            src={image}
            alt={title}
            className="max-h-[80vh] w-auto mx-auto object-contain"
          />
        </div>

        {title ? (
          <div className="mt-3 text-center text-white">
            <p className="text-lg font-semibold">{title}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
