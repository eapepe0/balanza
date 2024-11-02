import { Row , Col , Container} from "react-bootstrap"


export const AppBootstrap = () => {
  return (
    <>
    <Container fluid="md" style={{border : "2px solid orange"}}>
        <h1>Clases para Grid</h1>
        <Row style={{border : "2px solid green"}}>
            <p>Fila</p>
            <Col style={{border : "2px solid red"}}>
                Columna 1
            </Col>
            <Col style={{border : "2px solid blue"}}>
                Columna 2
            </Col>
        </Row>

        <Row style={{border : "2px solid green"}}>
            <p>Fila2</p>
            <Col style={{border : "2px solid red"}}>
                Columna 1
            </Col>
            <Col style={{border : "2px solid blue"}}>
                Columna 2
            </Col>
            <Col style={{border : "2px solid pink"}}>
                Columna 3
            </Col>
        </Row>
    </Container>


    <Container className="contenedor"> 
        .container
    </Container>

    <Container fluid="lg" className="contenedor">
        .container-fluid
    </Container>
    </>
  )
}
