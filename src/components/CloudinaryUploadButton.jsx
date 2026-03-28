"use client";

import { useEffect } from "react";

export default function CloudinaryUploadButton({ onUpload }) {
  useEffect(() => {
    if (document.getElementById("cloudinary-widget-script")) return;

    const script = document.createElement("script");
    script.id = "cloudinary-widget-script";
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function openWidget() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary bilgileri eksik.");
      return;
    }

    if (!window.cloudinary) {
      alert("Cloudinary widget henüz yüklenmedi.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url", "camera"],
        multiple: false,
        resourceType: "image",
        folder: "harun-designs",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        maxFiles: 1,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return;
        }

        if (result && result.event === "success") {
          onUpload(result.info.secure_url);
        }
      },
    );

    widget.open();
  }

  return (
    <button
      type="button"
      onClick={openWidget}
      className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-800 transition hover:border-black"
    >
      Bilgisayardan Görsel Seç
    </button>
  );
}
