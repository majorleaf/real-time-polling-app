import { io } from 'socket.io-client';
// dial server port

const socket = io('http://localhost:3000');

console.log('Attempting to connect to server...');

// listen
socket.on('connect', () => {
  console.log('\n Success! connected to the server.');
  console.log(`My unique Voter ID is: ${socket.id}\n`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
