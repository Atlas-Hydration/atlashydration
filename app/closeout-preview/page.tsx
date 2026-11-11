import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WarehouseCloseout from '@/app/components/home/WarehouseCloseout';
export const metadata: Metadata = { title: 'Atlas Warehouse Closeout | Preview', robots: { index: false, follow: false } };
export default function CloseoutPreview() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <WarehouseCloseout preview />;
}
