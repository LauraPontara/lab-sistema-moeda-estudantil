import type { Metadata } from "next";
import { Alegreya_Sans_SC, Lilita_One, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const displayFont = Alegreya_Sans_SC({
  variable: "--font-display",
  weight: ["800"],
  subsets: ["latin"],
});

const toonFont = Lilita_One({
  variable: "--font-toon",
  weight: ["400"],
  subsets: ["latin"],
});

const bodyFont = Nunito({
  variable: "--font-body",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XP Estudantil",
  description: "Sistema de moedas estudantil com identidade cartoon vintage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${toonFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
