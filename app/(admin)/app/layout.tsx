import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atlas Platform',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .header, .announcement-bar, footer, .cart-drawer, .sticky-buy-bar, .popup-overlay { display: none !important; }
      `}} />
      {children}
    </>
  );
}
