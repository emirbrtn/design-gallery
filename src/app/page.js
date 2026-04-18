"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import DesignGrid from "@/components/DesignGrid";
import BackToTopButton from "@/components/BackToTopButton";

const catalogFiles = [
  {
    title: "Toplu Katalog 1",
    href: "https://media.githubusercontent.com/media/emirbrtn/design-gallery/main/public/catalogs/toplu-katalog-1.pdf",
    size: "96.5 MB",
  },
  {
    title: "Toplu Katalog 2",
    href: "https://media.githubusercontent.com/media/emirbrtn/design-gallery/main/public/catalogs/toplu-katalog-2.pdf",
    size: "148.8 MB",
  },
];

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
    } catch {
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

  const showCatalogs = activeCategory === "tum-desenler";

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

        {showCatalogs ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {catalogFiles.map((catalog) => (
              <article
                key={catalog.href}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                      PDF Katalog
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-neutral-900">
                      {catalog.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-500">
                      {catalog.size}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d6a85f]/40 bg-[#fff8eb] text-[#9a6a21]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                  </span>
                </div>

                <a
                  href={catalog.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-[#d6a85f] bg-[#d6a85f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-[#b9893d] hover:bg-[#b9893d]"
                >
                  İndir
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 max-h-[68vh] overflow-y-auto rounded-[2rem] pr-1 md:max-h-[72vh] md:pr-3">
            {loading ? (
              <p className="text-center text-neutral-500">Yükleniyor...</p>
            ) : (
              <DesignGrid items={filteredDesigns} />
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-black/10 bg-[#efe7da]">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-neutral-600">
          Crafted by Emircan Bartan
        </div>
      </footer>

      <BackToTopButton />
    </main>
  );
}
