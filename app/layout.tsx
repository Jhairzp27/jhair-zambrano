import { KeyboardProvider } from "@/components/context/KeyboardContext";
import { SoundProvider } from "@/components/context/SoundContext";
import Header from "@/components/ui/Header";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Jhair Zambrano | Software Engineer",
  description: "Portafolio profesional de ingeniería de software de Jhair Zambrano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Arranca la descarga del modelo 3D de inmediato (en paralelo con el runtime),
            en vez de esperar a que monte el componente Spline. */}
        <link rel="preload" href="/models/keyboard.splinecode" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-black text-white`}>
        <SoundProvider>
          <KeyboardProvider>
            <Header />
            {children}
          </KeyboardProvider>
        </SoundProvider>
      </body>
    </html>
  );
}