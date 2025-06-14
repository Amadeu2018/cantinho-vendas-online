
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sobre/HeroSection';
import CompanyHistory from '@/components/sobre/CompanyHistory';
import ServicesSection from '@/components/sobre/ServicesSection';
import MenuCategories from '@/components/sobre/MenuCategories';
import FishSpecialties from '@/components/sobre/FishSpecialties';
import ClientsSection from '@/components/sobre/ClientsSection';
import ContactCTA from '@/components/sobre/ContactCTA';

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-cantinho-cream via-white to-cantinho-sand">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <CompanyHistory />
        <ServicesSection />
        <MenuCategories />
        <FishSpecialties />
        <ClientsSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
