"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "cloudinary-widget-script";

export default function CloudinaryUploadButton({ onUpload, onError }) {
  const widgetRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [widgetLoading, setWidgetLoading] = useState(true);

  useEffect(() => {
    if (window.cloudinary) {
      setScriptReady(true);
      setWidgetLoading(false);
    }
  }, []);

  function handleScriptReady() {
    setScriptReady(true);
    setWidgetLoading(false);
  }

  function buildWidget() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset || !window.cloudinary) {
      return null;
    }

    return window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local"],
        multiple: false,
        resourceType: "image",
        folder: "harun-designs",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        maxFiles: 1,
        maxImageFileSize: 5_000_000,
        singleUploadAutoClose: true,
        showAdvancedOptions: false,
        showSkipCropButton: false,
        cropping: false,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          onError?.("Görsel yükleme sırasında bir hata oluştu.");
          return;
        }

        if (result?.event === "success") {
          onUpload(result.info.secure_url);
        }
      },
    );
  }

  function prepareWidget() {
    if (!scriptReady || widgetRef.current) return;
    widgetRef.current = buildWidget();
  }

  function openWidget() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      onError?.("Cloudinary bilgileri eksik.");
      return;
    }

    if (!scriptReady || !window.cloudinary) {
      setWidgetLoading(true);
      onError?.("Yükleyici hazırlanıyor, lütfen 1-2 saniye sonra tekrar deneyin.");
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = buildWidget();
    }

    widgetRef.current?.open();
  }

  return (
    <>
      <Script
        id={SCRIPT_ID}
        src="https://upload-widget.cloudinary.com/latest/global/all.js"
        strategy="afterInteractive"
        onLoad={handleScriptReady}
      />

      <button
        type="button"
        onClick={openWidget}
        onPointerEnter={prepareWidget}
        onFocus={prepareWidget}
        disabled={widgetLoading}
        className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-800 transition hover:border-black disabled:cursor-wait disabled:opacity-70"
      >
        {widgetLoading ? "Yükleyici hazırlanıyor..." : "Bilgisayardan Görsel Seç"}
      </button>
    </>
  );
}
