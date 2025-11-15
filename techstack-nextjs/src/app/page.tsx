'use client';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import Services from '@/components/Services';
import TestimonialSection from '@/components/TestimonialSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="App">
      <Navigation />
      <Hero />
      <AboutUs />
      <Services />
      <TestimonialSection />
      <Contact />
      <Footer />
    </div>
  );
}
