"use client";

import { useMemo, useState } from "react";
import { optimizeCloudinaryImage } from "@/lib/cloudinary";
import ImageModal from "@/components/ImageModal";

export default function DesignCard({ design, index = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const cardImage = useMemo(
    () => optimizeCloudinaryImage(design.image, 700),
    [design.image],
  );
  const modalImage = useMemo(
    () => optimizeCloudinaryImage(design.image, 1400),
    [design.image],
  );

  const eagerLoad = index < 4;

  return (
    <>
      <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="block w-full text-left"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
            {!isLoaded ? (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200" />
            ) : null}

            <img
              src={cardImage}
              alt={design.title}
              className={`h-full w-full object-cover transition duration-500 hover:scale-105 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading={eagerLoad ? "eager" : "lazy"}
              fetchPriority={eagerLoad ? "high" : "auto"}
              decoding="async"
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </button>

        <div className="p-3 md:p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 md:text-xs">
            {design.category}
          </p>

          <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-neutral-900 md:text-base">
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
