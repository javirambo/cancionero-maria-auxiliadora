import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";
import { TransposeProvider } from "@/components/TransposeContext";
import { ChordsProvider } from "@/components/ChordsContext";
import { SongProvider } from "@/components/SongContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cancionero María Auxiliadora",
  description: "Digital songbook for the choir.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <TransposeProvider>
          <ChordsProvider>
            <SongProvider>
              <Navbar />
              <main className="container py-6 pb-24">
                {children}
              </main>
              <BottomBar />
            </SongProvider>
          </ChordsProvider>
        </TransposeProvider>
      </body>
    </html>
  );
}
