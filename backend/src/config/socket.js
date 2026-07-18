const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const registerHandlers = require('../sockets');


function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.use(socketAuth); 
  io.on('connection', (socket) => {
    registerHandlers(io, socket);
  });

  return io;
}

module.exports = initSocket;
