import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hindustan Yuva Vrindha",
  description:
    "Hindustan Yuva Vrindha - Rooted in tradition, united by faith, and inspired by Sanatana Dharma.",
  icons: {
    icon: "/icon.png",
  },
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