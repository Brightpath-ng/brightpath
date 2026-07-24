import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrightPath",
  description: "BrightPath — the authenticated product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
