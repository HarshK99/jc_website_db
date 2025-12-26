import type { Metadata } from "next";
import { Montserrat, Crimson_Text, Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

const inter = Inter({
  variable: "--font-navbar",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JNC Group - News Channel and Books Publisher",
  description: "Come to the point. Go to the root. Publishing books that inspire young minds.",
  icons: {
    icon: "/logo_bg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${crimsonText.variable} ${inter.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
