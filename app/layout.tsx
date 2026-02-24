import SmoothScroll from "@/components/utils/SmoothScroll";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Configuramos las tipografías
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

// Esta es la etiqueta <title> y <meta> para el SEO
export const metadata: Metadata = {
  title: "Creative Portfolio | Software Engineer",
  description: "Portafolio profesional de ingeniería de software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">
        {/* Aquí inyectamos el scroll suave a todo el sitio */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}