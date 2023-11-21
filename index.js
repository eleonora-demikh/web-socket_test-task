const ws = require('ws');

const PORT = process.env.PORT || 5000;

const wss = new ws.Server({ port: PORT });

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

wss.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});