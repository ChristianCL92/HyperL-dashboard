import type { Metadata } from "next";
import { Barlow_Condensed, Fira_Code, Geist } from "next/font/google";
import Provider from "@/provider/QueryProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      className={cn("dark", barlowCondensed.variable, firaCode.variable, "font-sans", geist.variable)}
    >
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
