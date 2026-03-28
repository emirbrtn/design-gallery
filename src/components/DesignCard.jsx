"use client";

import { useState } from "react";
import { optimizeCloudinaryImage } from "@/lib/cloudinary";
import ImageModal from "@/components/ImageModal";

export default function DesignCard({ design }) {
  const [isOpen, setIsOpen] = useState(false);

  const cardImage = optimizeCloudinaryImage(design.image, 700);
  const modalImage = optimizeCloudinaryImage(design.image, 1400);

  return (
    <>
      <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="block w-full text-left"
        >
          <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-200">
            <img
              src={cardImage}
              alt={design.title}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        </button>

        <div className="p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            {design.category}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-neutral-900">
            {design.title}
          </h3>
        </div>
      </article>

      <ImageModal
        image={modalImage}
        title={design.title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
