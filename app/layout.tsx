import type { Metadata } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/inter";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://alvinshotit.com";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Alvin Shot It | Photography & Video", template: "%s | Alvin Shot It" },
  description: "Photography and video by Alvin Shot It. Portraits, weddings, events and brand stories.",
  openGraph: { type: "website", siteName: "Alvin Shot It" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
