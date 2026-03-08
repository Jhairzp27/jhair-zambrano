import Header from "@/components/ui/Header";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/context/SoundContext";

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-black text-white`}>
        <SoundProvider>
          <Header />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}