import { redirect } from 'next/navigation';

type ProductRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductRouteProps) {
  await params;
  redirect('/rfq');
}
