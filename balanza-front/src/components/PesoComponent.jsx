import {  useState , useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import PesoContext from '../context/PesoContext';


function PesoComponent() {

  const  peso = useContext(PesoContext);
  console.log(peso)
  const currentWeight =  peso;
  
  const [tara, setTara] = useState(0);
  console.log(tara)
  
  const handleSetTara = async () => {
    try {
      await fetch('http://localhost:4000/setTara', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tara: currentWeight }),
      });
      console.log('Tara....')
      setTara(currentWeight);
    } catch (error) {
      console.error('Error al establecer la tara:', error);
    }
  };

  return (
    <Row>
      <h1>Peso Neto: {currentWeight} kg</h1>
      <Button variant='success' onClick={handleSetTara}>Establecer Tara</Button>
      <p>Tara actual: {tara} kg</p>
    </Row>
  );
}

export default PesoComponent;