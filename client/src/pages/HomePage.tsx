import { products, testimonials } from '@/data/products';
import HomeClient from '@/components/HomeClient';

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
