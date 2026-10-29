import type { Metadata } from "next";
import { Geist, Literata } from "next/font/google";
import { Navbar } from "@/shared/components/Navbar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const literata = Literata({ variable: "--font-literata", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Gestión de libros y autores",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${literata.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
