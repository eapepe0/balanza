import { useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Navbar, Container, Row, Col } from 'react-bootstrap';

import PesoComponent from './components/PesoComponent'
import IndicadorPeso from './components/IndicadorPeso';
import RecipeSteps from './components/RecipeSteps';


const receta = [
  { description: 'Preparar 400g de pasta gianduia', targetWeight: 400, currentWeight:400 },
  { description: 'Añadir 100g de cerelose', targetWeight: 100, currentWeight: 0 },
  { description: 'Receta completada' }
];

function App() {

  return (

    <div>
      {/* Navbar celeste */}
      <Navbar bg="light" variant="light" fixed="top">
      <Container>
          <Navbar.Brand href="#home">Mi Aplicación</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <a href="#login">Iniciar sesión</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenedor verde */}
      <Container fluid className="mt-5 d-flex justify-content-center align-items-center" style={{height :'calc(100vh - 56px)' }}>
         {/* Contenedor amarillo */}
        <Row >
        <Col xs={12} md={6} className="mb-3">
          <h1>Balanza</h1>
           <PesoComponent/> 
           <IndicadorPeso targetWeight={1500} currentWeight={1501} />
        </Col>
       
        {/* Contenedor violeta */}
       
        <Col xs={12} md={6}>
        <h1>Receta : Nutella</h1>
        <RecipeSteps recipe={receta} />;
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
