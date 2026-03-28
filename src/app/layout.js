import "./globals.css";

export const metadata = {
  title: "Harun Ateşoğlu Design Studio",
  description: "Sonsuz, parça ve rulo tasarımları",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
