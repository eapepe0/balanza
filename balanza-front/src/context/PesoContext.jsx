import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const PesoContext = createContext();

const socket = io('http://localhost:4000');

export const PesoProvider = ({ children }) => {
  const [pesoNeto, setPesoNeto] = useState(0);
  const [pesoActual , setPesoActual] = useState(0);
  useEffect(() => {
    socket.on('pesoNeto', (pesoNeto) => {
      setPesoNeto(pesoNeto);
      console.log(pesoNeto)
    });

    socket.on('peso',(peso)=> {
      setPesoActual(peso);
      console.log(peso)
    })

    return () => {
      socket.off('pesoNeto');
      socket.off('peso');
    };
  }, []);

  return (
    <PesoContext.Provider value={{ pesoNeto, setPesoNeto , pesoActual , setPesoActual }}>
      {children}
    </PesoContext.Provider>
  );
};

export default PesoProvider;
