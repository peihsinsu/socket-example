var server = require('http').createServer();
var io = require('socket.io')(server);


if(process.env.REDIS_SERVER) {
	//For clustering socket server
	var redis = require('socket.io-redis');
	//You can run the redis server: docker run --name myredis -p 6379:6379 -d redis
	io.adapter(redis({ host: process.env.REDIS_SERVER || 'localhost', port: 6379 }));
}

io.on('connection', function(client){
  client.on('message', function(data){
    console.log('Got message:', data);
  });

	if(process.env.TALK) {
    setInterval(function(){
			client.emit('message', genTalk());
		}, process.env.INTERVAL || 3000);
	}
  client.on('disconnect', function(){
		console.log('client:%s disconnect', client.id);
  });
});
server.listen(process.env.PORT || 3000);



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
