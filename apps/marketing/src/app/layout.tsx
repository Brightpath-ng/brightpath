import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "BrightPath — Trusted tutors. Measurable progress.",
  description: "Managed tutoring and measurable learning progress for students in Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
