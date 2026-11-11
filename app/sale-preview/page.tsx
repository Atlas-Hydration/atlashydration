import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StrawberrySale from '@/app/components/home/StrawberrySale';

export const metadata: Metadata = { title: 'Atlas Strawberry Sale | Design Review', robots: { index: false, follow: false } };
export default function SalePreview() {
  // Never make the review route available in production builds.
  if (process.env.NODE_ENV === 'production') notFound();
  return <StrawberrySale />;
}
