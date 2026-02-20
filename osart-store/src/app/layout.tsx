import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Osart Repuestos Electrónicos | La energía que mueve tus reparaciones",
  description: "Venta de repuestos electrónicos de alta precisión.",
};

import { PageWrapper } from "@/components/layout/PageWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
