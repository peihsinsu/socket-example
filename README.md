# Web Socket Test Program

## Run Server

```
node server.js
```

Run with talk to each client of an interval...

```
export TALK=true
export INTERVAL=3000
node server.js
```

Run with broadcast to each client of an interval...

```
export BROADCAST=true
export INTERVAL=3000
node server.js
```

## Run Client

```
node client.js
```

Run with non-localhost socket server

```
export SOCKET_SERVER=http://ts-apserver:3000
node client.js
```

Run with talk to server of an interval...

```
export SOCKET_SERVER=http://ts-apserver:3000
export INTERVAL=3000
node client.js
```


