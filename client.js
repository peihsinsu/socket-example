var util = require('util');
var socket_server = process.env.SOCKET_SERVER || process.argv[2] || 'http://localhost:3000';

console.log('using server:', socket_server);

var data = { 
    roomid: 'idf-test',
    email: 'simonsu.mail@gmail.com', 
    token: '3eea71e6f263c13de696e999491118033e62f545133e4186b6b4c14a90b3031e9b332078a6fe1c655d25a917e06eb43b' 
  };

var socket = require('socket.io-client')(socket_server, {query:data});

socket.on('connect', function(){
  console.log('on connect...', (socket.id));
});

socket.on('message', function(data){
  console.log('[%s][%s] got event...', socket.id, new Date().getTime(), data);
});

if(process.env.TALK) {
	setInterval(function(){
	  socket.emit('message', genTalk());
	}, process.env.INTERVAL || 3000);
}

socket.on('disconnect', function(){
  console.log('[%s] disconnect....', socket.id);
});

var talk = ['hello!', 'nice to meet you....', 'good job', 'gg...@@',
  'who are you?', 'good morning', ':D', ':(', 'give up...'];
function genTalk() {
  var idx = Math.round(Math.random()*1000) % talk.length;
  return {
    type: 'text',
    content: talk[idx],
    ts: new Date().getTime()
  };
}

