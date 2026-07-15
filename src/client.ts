import { io } from 'socket.io-client';
import * as readline from 'readline';

//Set up a terminal interface so we can type while the script runs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
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
  console.log(`\n  ---LIVE POLL: ${data.title.toUpperCase()} ---`);

  const options = Object.entries(data.options));

  //if there are no options yet , tell the user
  if (Options.length === 0) {
     console.log(' (No options yet. Be the first to add one!');
  } else {

  }
  
});



socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
