
import React, { createContext, useContext, useState, useEffect } from 'react';

interface EventPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface EventContextType {
  selectedPackage: EventPackage | null;
  setSelectedPackage: (pkg: EventPackage | null) => void;
  isPackageSelected: boolean;
  clearSelection: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<EventPackage | null>(null);

  // Check URL parameters on mount to restore package selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    
    if (packageId) {
      // Map package IDs to package data
      const packages: Record<string, EventPackage> = {
        'essencial': {
          id: 'essencial',
          name: 'Pacote Essencial',
          price: 25000,
          description: 'Menu de entrada, prato principal e sobremesa',
          features: [
            'Menu de entrada, prato principal e sobremesa',
            'Águas e refrigerantes incluídos',
            'Equipe de serviço básica',
            'Material de serviço padrão'
          ]
        },
        'premium': {
          id: 'premium',
          name: 'Pacote Premium',
          price: 35000,
          description: 'Menu gourmet de 4 tempos',
          features: [
            'Menu gourmet de 4 tempos',
            'Open bar de bebidas não alcoólicas',
            'Equipe completa de serviço',
            'Material de serviço premium',
            'Mesa de sobremesas especiais'
          ]
        },
        'exclusivo': {
          id: 'exclusivo',
          name: 'Pacote Exclusivo',
          price: 50000,
          description: 'Menu degustação de luxo personalizado',
          features: [
            'Menu degustação de luxo personalizado',
            'Open bar completo de bebidas',
            'Estações gastronômicas ao vivo',
            'Decoração de mesas temática',
            'Consultoria de evento completa'
          ]
        }
      };
      
      if (packages[packageId]) {
        setSelectedPackage(packages[packageId]);
      }
    }
  }, []);

  const handleSetSelectedPackage = (pkg: EventPackage | null) => {
    setSelectedPackage(pkg);
    
    // Update URL to reflect selection
    if (pkg) {
      const url = new URL(window.location.href);
      url.searchParams.set('package', pkg.id);
      window.history.pushState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('package');
      window.history.pushState({}, '', url.toString());
    }
  };

  const clearSelection = () => {
    setSelectedPackage(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('package');
    window.history.pushState({}, '', url.toString());
  };

  const value = {
    selectedPackage,
    setSelectedPackage: handleSetSelectedPackage,
    isPackageSelected: !!selectedPackage,
    clearSelection
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
