import { Metadata } from 'next';
import { products, testimonials } from '@/data/products';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Le Pondicherry Cheese | Handcrafted Artisan Cheese',
  description: 'Experience the fusion of French tradition and Indian craftsmanship. Premium handcrafted artisan cheeses from Pondicherry, delivered across India.',
  openGraph: {
    title: 'Le Pondicherry Cheese | Handcrafted Artisan Cheese',
    description: 'Experience the fusion of French tradition and Indian craftsmanship.',
    url: 'https://lepondicheese.com',
  },
};

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured && p.category !== 'subscriptions');
  const subscriptionPlans = products.filter(p => p.category === 'subscriptions');

  return (
    <HomeClient
       featuredProducts={featuredProducts}
      subscriptionPlans={subscriptionPlans}
      testimonials={testimonials}
    />
  );
}
