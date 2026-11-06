import {
  Funnel_Sans,
  Funnel_Display,
  Newsreader,
  Inter,
  Geist_Mono,
} from "next/font/google";

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  weight: "500",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const landingFontClasses = [
  funnelSans.variable,
  funnelDisplay.variable,
  newsreader.variable,
  inter.variable,
  geistMono.variable,
].join(" ");
