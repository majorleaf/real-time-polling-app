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
  //data now contains titles and options
  console.log(`\n  --- LIVE POLL: ${data.title.toUpperCase()} ---`);

  const options = Object.entries(data.options);

  if (options.length === 0) {
    console.log(' (No options et. Be the first to add one!');
  } else {
    // for loop through the option and print them clearly
    for (const [option, votes] of options) {
      console.log(` ${option}: ${votes} votes`);
    }
  }

  console.log('------------------------\n');

  // keep the terminal open and ask for user request
  rl.question(
    '  Vote, "add: Option", OR "create: New Poll Topic": ',
    (answer) => {
      const input = answer.trim();

      //Parse the command and send the appropriate event to the server
      if (input.toLowerCase().startsWith('add:')) {
        // tell the server to add a new option
        socket.emit('ADD_OPTION', input.substring(4).trim());
      } else if (input.toLowerCase().startsWith('create:')) {
        // tell server to create a whole new poll
        socket.emit('CREATE_POLL', input.substring(7).trim());
      } else {
        // just submit as standard vote
        socket.emit('VOTE', input);
      }
    },
  );
});

// Listen for errors e.g. sth that does not exist etc.
socket.on('ERROR', (message) => {
  console.log(`\n Server Error: ${message}`);

  //keep the prompt going even if they make a mistake so the app doesnt freeze
  rl.question(
    ' Try again (Vote, "add: Option", or "create: Topic"): ',
    (answer) => {
      const input = answer.trim();
      if (input.toLowerCase().startsWith('add:')) {
        socket.emit('ADD_OPTION', input.substring(4).trim());
      } else if (input.toLowerCase().startsWith('create:')) {
        socket.emit('CREATE_POLL', input.substring(7).trim());
      } else {
        socket.emit('VOTE', input);
      }
    },
  );
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});
