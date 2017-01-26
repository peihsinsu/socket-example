exports.run = function(io) {
    var sio = io.on('connection', function(client) {
        client.on('message', function(data) {
            console.log('Got message:', data);
            sio.emit('message', data); //broadcast to everyone...
        });

        if (process.env.TALK) {
            setInterval(function() {
                client.emit('message', genTalk());
            }, process.env.INTERVAL || 3000);
        }
        client.on('disconnect', function() {
            console.log('client:%s disconnect', client.id);
        });
    });

    //if(process.env.BROADCAST)
    setInterval(function() {
        console.log('current connected devices...', Object.keys(sio.sockets).length);
    //     sio.emit('message', 'sio emit... ' + new Date().getTime());
    //     if (process.env.COUCHDB)
    //         monitor.setSockets(Object.keys(sio.sockets).length);
    }, process.env.INTERVAL || 3000);

    // server.listen(process.env.PORT || 3000);

    var talk = ['hello!', 'nice to meet you....', 'good job', 'gg...@@',
        'who are you?', 'good morning', ':D', ':(', 'give up...'
    ];

    function genTalk() {
        var idx = Math.round(Math.random() * 1000) % talk.length;
        return {
            type: 'text',
            content: talk[idx],
            ts: new Date().getTime()
        };
    }
}