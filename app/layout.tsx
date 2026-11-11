import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import ScrollToTop from "@/app/components/ScrollToTop";
import { SignupPopupProvider } from "@/app/components/SignupPopup";
import CookieConsent from "@/app/components/CookieConsent";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/app/data/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1d1d1f",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Atlas Hydration | Premium Electrolyte Drink Mix",
  description:
    "Zero sugar, 1,769mg electrolytes, B vitamins, and amino acids. Premium hydration for peak performance.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE] },
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
        <meta name="theme-color" content="#1d1d1f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://customer-1sijhr9xl3yqixxu.cloudflarestream.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
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
          <SignupPopupProvider>
            <ScrollToTop />
            <Header />
            {children}
            <Footer />
            <CartDrawer />
          </SignupPopupProvider>
        </CartProvider>
        <CookieConsent />
        <span className="junip-store-key" data-store-key="anLwjMqeGdCvG9w79wSpfM16" />
        <Script src="https://widgets.juniphq.com/v1/junip_shopify.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
