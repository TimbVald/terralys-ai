
import Features from '@/components/landing/features';
import Hero from '@/components/landing/hero';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// const Testimonials = dynamic(() => import('@/components/landing/testimonial'), {
//   ssr: false,
// });

const Tech = dynamic(() => import('@/components/landing/tech')
);

const Pricing = dynamic(() => import('@/components/landing/pricing'));

const Contact = dynamic(() => import('@/components/landing/contact'));

export const metadata: Metadata = {
  title: "Machine Care - Accueil",
  description: "Ceci est la page d'accueil de Machine Care",
};

export default function Homepage() {
  return (
    <>
      <Hero />
      <Features />
      <Tech />
      {/* <Testimonials /> */}
      <Pricing />
      {/* <Contact /> */}
    </>
  );
}
