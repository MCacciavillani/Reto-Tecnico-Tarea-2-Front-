import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components
import {Navbar} from "@/components/navbar";
import { AuthProvider } from "./context/authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor de empresas",
  description: "Gestor de empresas con Superadmin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>

        <header className="flex justify-end w-full h-1/12 bg-blue-500">
          <Navbar/>
        </header>

        <main className=" bg-blue-400 h-9/12 overflow-y-auto">
        {children}
        </main>

        <footer className="h-2/12 bg-blue-500">

        </footer>
          </AuthProvider>

      </body>
    </html>
  );
}
