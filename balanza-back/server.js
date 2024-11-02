const express = require('express');
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');
const { SerialPort } = require('serialport');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Permite la URL de tu frontend
      methods: ['GET', 'POST'],
    },
  });
  
  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());

let tara = 0;

const port = new SerialPort({
  path: 'COM1',
  baudRate: 9600,
});

port.on('open', () => {
  console.log('Puerto COM1 abierto');
});

port.on('data', (data) => {

  
  const dataString = data.toString('utf-8').trim();
  const pesoString = dataString.replace(/[^0-9.-]/g, '');

  const peso = parseFloat(pesoString);

  const pesoNeto = peso - tara;

  console.log('Peso: ',peso);
  console.log('Peso Neto: ',pesoNeto);
  io.emit('pesoNeto', pesoNeto); // Enviar el peso neto a los clientes conectados
  io.emit('peso', peso); // Enviar el peso  a los clientes conectados
});


port.on('error', (err) => {
  console.error('Error:', err.message);
});

// Ruta para establecer la tara
app.post('/setTara', (req, res) => {
  tara = req.body.tara || 0;
  console.log('Tara establecida en:', tara);
  res.sendStatus(200);
});

app.post('/emulateWeight', (req, res) => {
  const pesoEmulado = req.body.peso;
  const pesoNeto = pesoEmulado - tara; // Aplica la tara
  io.emit('peso', pesoNeto); // Envía el peso neto emulado a los clientes
  console.log('Peso emulado enviado:', pesoNeto);
  res.sendStatus(200);
});

server.listen(4000, () => {
  console.log('Servidor en http://localhost:4000');
});