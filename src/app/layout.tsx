
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Katihar Run Club | Own Your Streets",
    template: "%s | Katihar Run Club",
  },
  description:
    "Walk, run and compete with your city. Track your progress, chase personal bests and join Katihar's local running community.",
  applicationName: "Katihar Run Club",
  keywords: [
    "Katihar",
    "running",
    "walking",
    "jogging",
    "fitness",
    "leaderboard",
    "Bihar",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Katihar Run Club",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090b0f",
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
