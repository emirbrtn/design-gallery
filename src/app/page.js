"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import DesignGrid from "@/components/DesignGrid";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("sonsuz");
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDesigns(showLoader = false) {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const res = await fetch("/api/designs", {
        cache: "no-store",
      });

      const data = await res.json();
      setDesigns(Array.isArray(data) ? data : []);
    } catch (error) {
      setDesigns([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchDesigns(true);

    const interval = setInterval(() => {
      fetchDesigns(false);
    }, 3000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchDesigns(false);
      }
    }

    window.addEventListener("focus", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleVisibilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const filteredDesigns = useMemo(() => {
    return designs.filter((item) => item.category === activeCategory);
  }, [designs, activeCategory]);

  return (
    <main className="min-h-screen bg-[#f4efe7]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Koleksiyonlar
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-neutral-900 md:text-4xl">
            Kategoriye göre tasarımlar
          </h2>
        </div>

        <div className="mt-8">
          <CategoryTabs
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="text-center text-neutral-500">Yükleniyor...</p>
          ) : (
            <DesignGrid items={filteredDesigns} />
          )}
        </div>
      </section>
    </main>
  );
}
