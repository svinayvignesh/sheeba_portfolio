import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Sheeba Sukumaran | Director of Business Transformation",
  description:
    "Driving measurable impact through digital transformation, AI automation, M&A integration, and strategic innovation. 20+ years of enterprise transformation leadership.",
  keywords: [
    "business transformation",
    "digital transformation",
    "AI automation",
    "M&A integration",
    "process innovation",
    "Sheeba Sukumaran",
  ],
  openGraph: {
    title: "Sheeba Sukumaran | Director of Business Transformation",
    description:
      "Driving measurable impact through digital transformation, AI automation, M&A integration, and strategic innovation.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
