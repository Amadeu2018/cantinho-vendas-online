
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/pwa-responsive.css'

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
