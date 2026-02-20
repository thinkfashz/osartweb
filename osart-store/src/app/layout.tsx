import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "Osart Repuestos Electrónicos | La energía que mueve tus reparaciones",
  description: "Venta de repuestos electrónicos de alta precisión.",
  generator: 'Next.js',
  manifest: "/manifest.json",
  keywords: ['repuestos', 'electrónica', 'pwa', 'osart', 'precisión'],
  themeColor: '#050505',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OSART",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-black">
      <body className="flex flex-col min-h-screen safe-area-pb overflow-x-hidden bg-[#050505] text-white">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20 md:pt-24 safe-area-pt">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>
          <Footer />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
