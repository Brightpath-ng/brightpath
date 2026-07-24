import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrightPath — Trusted tutors. Measurable progress.",
  description: "Managed tutoring and learning platform for Nigeria.",
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
