import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sobre/HeroSection";
import CompanyHistory from "@/components/sobre/CompanyHistory";
import ServicesSection from "@/components/sobre/ServicesSection";
import GallerySection from "@/components/sobre/GallerySection";
import MenuCategories from "@/components/sobre/MenuCategories";
import FishSpecialties from "@/components/sobre/FishSpecialties";
import ClientsSection from "@/components/sobre/ClientsSection";
import ContactCTA from "@/components/sobre/ContactCTA";

const Sobre = () => {
  const companyStats = [
    { label: "Anos de Experiência", value: "8+" },
    { label: "Clientes Satisfeitos", value: "100+" },
    { label: "Pratos Servidos", value: "10K+" },
    { label: "Eventos Realizados", value: "500+" },
  ];

  const services = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Pequeno Almoço",
      description: "Opções nutritivas, saborosas e frescas logo cedo",
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Almoço",
      description: "Pratos tradicionais e contemporâneos para seu almoço",
    },
    {
      icon: <Fish className="w-8 h-8" />,
      title: "Jantar",
      description: "Gastronomia única para noites inesquecíveis",
    },
  ];

  const timelineEvents = [
    {
      year: "2014",
      title: "Fundação da Empresa",
      description: "Início das atividades com foco em qualidade e tradição",
    },
    {
      year: "2016",
      title: "Certificação HACCP",
      description: "Obtenção da certificação de segurança alimentar",
    },
    {
      year: "2018",
      title: "Expansão de Serviços",
      description: "Ampliação para catering corporativo e eventos",
    },
    {
      year: "2022",
      title: "Liderança no Mercado",
      description: "Consolidação como referência em Angola",
    },
  ];

  const testimonials = [
    {
      name: "ETAL",
      role: "Parceiro Estratégico",
      content:
        "Parceria estratégica em alimentação corporativa com excelência comprovada.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=etal",
    },
    {
      name: "SPIC Oil & Gas Angola",
      role: "Cliente Corporativo",
      content:
        "Serviços de catering especializado para indústria petrolífera com qualidade superior.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=spic",
    },
  ];
};

export default Sobre;
