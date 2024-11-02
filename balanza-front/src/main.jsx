import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

//import App from './App.jsx'
import { PesoProvider } from './context/PesoContext.jsx';
import { StrictMode } from 'react';
import { AppBootstrap } from './AppBootstrap.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <PesoProvider>
    <AppBootstrap />
  </PesoProvider>
  </StrictMode>
 
)
