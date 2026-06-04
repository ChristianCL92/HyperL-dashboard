import type { Metadata } from "next";
import { Barlow_Condensed, Fira_Code } from "next/font/google";
import Provider from "@/provider/QueryProvider";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  weight: ["300", "400", "500", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HYPERLIQUID // DASHBOARD",
  description: "Portfolio intelligence for Hyperliquid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${firaCode.variable} dark`}
    >
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
