"use client";

import { categories } from "@/data/categories";

export default function CategoryTabs({ activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {categories.map((category) => {
        const active = activeCategory === category.key;

        return (
          <button
            key={category.key}
            onClick={() => onChange(category.key)}
            className={`rounded-full border px-6 py-2 text-sm font-medium transition md:text-base ${
              active
                ? "border-black bg-black text-[#d6a85f]"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
