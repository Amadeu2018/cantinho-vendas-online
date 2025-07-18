import { ReactNode, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";

interface PWALayoutProps {
  children: ReactNode;
}

const PWALayout = ({ children }: PWALayoutProps) => {
  const { isInstalled } = usePWA();

  useEffect(() => {
    // Add PWA safe area classes to body when installed
    if (isInstalled) {
      document.body.classList.add('pwa-safe-area');
    } else {
      document.body.classList.remove('pwa-safe-area');
    }

    return () => {
      document.body.classList.remove('pwa-safe-area');
    };
  }, [isInstalled]);

  return (
    <div className={`min-h-screen ${isInstalled ? 'ios-safe-area' : ''}`}>
      {children}
    </div>
  );
};

export default PWALayout;