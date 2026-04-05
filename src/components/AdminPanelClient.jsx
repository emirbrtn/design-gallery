"use client";

import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";
import { optimizeCloudinaryImage } from "@/lib/cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const initialForm = {
  title: "",
  category: "sonsuz",
  image: "",
};

const categories = [
  { key: "sonsuz", label: "Sonsuz" },
  { key: "parca", label: "Parça" },
  { key: "rulo", label: "Rulo" },
];

export default function AdminPanelClient() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("sonsuz");

  async function fetchDesigns() {
    try {
      const res = await fetch("/api/designs", { cache: "no-store" });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Tasarımlar alınamadı.");
    }
  }

  useEffect(() => {
    fetchDesigns();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!form.title || !form.category || !form.image) {
      setMessage("Tüm alanlar zorunlu.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Bir hata oluştu.");
        return;
      }

      setItems((prev) => [data, ...prev]);
      localStorage.setItem("designs-updated", String(Date.now()));
      setActiveCategory(data.category);
      setMessage("Tasarım başarıyla eklendi.");
      setForm(initialForm);
    } catch {
      setMessage("Sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Bu tasarım silinsin mi?");
    if (!confirmed) return;

    setMessage("");

    try {
      const res = await fetch(`/api/designs/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Silme işlemi başarısız.");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      localStorage.setItem("designs-updated", String(Date.now()));
      setMessage("Tasarım silindi.");
    } catch {
      setMessage("Silme sırasında hata oluştu.");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin-logout", {
        method: "POST",
      });

      router.push("/admin-login");
      router.refresh();
    } catch {
      setMessage("Çıkış yapılamadı.");
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <main className="min-h-screen bg-[#f4efe7] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900">
              Admin Paneli
            </h1>
            <p className="mt-2 text-neutral-600">
              Buradan yeni tasarım ekleyebilirsin.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-black"
          >
            Çıkış Yap
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">
              Yeni Tasarım Ekle
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Başlık
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Örn: Leopar Gold"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Kategori
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                >
                  <option value="sonsuz">Sonsuz</option>
                  <option value="parca">Parça</option>
                  <option value="rulo">Rulo</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Görsel
                </label>

                <div className="flex flex-col gap-3">
                  <CloudinaryUploadButton
                    onUpload={(url) => {
                      setForm((prev) => ({
                        ...prev,
                        image: url,
                      }));
                      setMessage("Görsel yüklendi.");
                    }}
                    onError={(errorMessage) => {
                      setMessage(errorMessage);
                    }}
                  />

                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    placeholder="Yüklenen görsel URL'si burada görünecek"
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                    readOnly
                  />
                </div>

                {form.image ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
                    <img
                      src={optimizeCloudinaryImage(form.image, 700)}
                      alt="Önizleme"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Ekleniyor..." : "Tasarımı Kaydet"}
              </button>

              {message ? (
                <p className="text-sm text-neutral-700">{message}</p>
              ) : null}
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">
              Eklenen Tasarımlar
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((category) => {
                const active = activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
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

            <div className="mt-6 space-y-4">
              {filteredItems.length === 0 ? (
                <p className="text-neutral-500">
                  Bu kategoride henüz kayıt yok.
                </p>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-3"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={optimizeCloudinaryImage(item.image, 200)}
                        alt={item.title}
                        className="h-20 w-20 rounded-lg object-cover"
                        loading="lazy"
                      />

                      <div>
                        <p className="font-semibold text-neutral-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
