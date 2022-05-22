const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const _ = require('lodash');
const Consumer = require('../../shared/Consumer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

server.listen(3001, () => {
  console.log('listening on 3001 port');
});

const sockets = [];

io.on('connect', (socket) => {
  console.log('User joined');
  sockets.push(socket);

  socket.on('disconnect', () => {
    console.log('User left');
    _.pull(sockets, socket);
  });
});

const consumer = new Consumer({
  groupId: 'task-management-socket',
  topics: ['task-events'],
  eachMessage: async (command) => {
    await Promise.all(sockets.map(async (socket) => {
      await socket.emit(command.eventName, JSON.stringify(command));
    }));
  },

});

consumer.start();
