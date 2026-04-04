import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import { PopupProvider } from "@/app/components/Popup";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import ScrollToTop from "@/app/components/ScrollToTop";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1d1d1f",
};

export const metadata: Metadata = {
  title: "Atlas Hydration | Premium Electrolyte Drink Mix",
  description:
    "Zero sugar, 1,769mg electrolytes, B vitamins, and amino acids. Premium hydration for peak performance.",
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J2NYD0S2BR" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J2NYD0S2BR');
        `}</Script>
        <meta name="theme-color" content="#1d1d1f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://customer-1sijhr9xl3yqixxu.cloudflarestream.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <CartProvider>
          <PopupProvider>
            <ScrollToTop />
            <Header />
            {children}
            <Footer />
            <CartDrawer />
          </PopupProvider>
        </CartProvider>
        <span className="junip-store-key" data-store-key="anLwjMqeGdCvG9w79wSpfM16" />
        <Script src="https://widgets.juniphq.com/v1/junip_shopify.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
