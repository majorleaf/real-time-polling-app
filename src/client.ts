import { io } from 'socket.io-client';
// dial server port

const socket = io('http://localhost:3000');

console.log('Attempting to connect to server...');

// listen
socket.on('connect', () => {
  console.log('\n Success! connected to the server.');
  console.log(`My unique Voter ID is: ${socket.id}\n`);

  console.log('Sending pre-defined request: GET_POLL_STATUS...');
  socket.emit('GET_POLL_STATUS');
});

//NB:completely non-blocking
//It just wait patiently in the backgroundw until the sever replies
socket.on('POLL_UPDATE', (data) => {
  console.log('\n Automatic response received from server:');
  console.log(data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
