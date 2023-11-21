const http = require('http');
const express = require('express');
const ws = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new ws.Server({ server });

wss.on('connection', (ws) => {
  console.log('New person connected');

  ws.on('message', (message) => {
    message = JSON.parse(message);

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  });

  ws.on('close', () => {
    console.log('Person was disconnected');
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});