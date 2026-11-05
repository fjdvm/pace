import {
  Funnel_Sans,
  Funnel_Display,
  Libre_Caslon_Text,
  JetBrains_Mono,
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

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-caslon",
  weight: "400",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
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
  libreCaslon.variable,
  jetBrainsMono.variable,
  newsreader.variable,
  inter.variable,
  geistMono.variable,
].join(" ");
