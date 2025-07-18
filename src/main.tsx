
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/pwa-responsive.css'
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
