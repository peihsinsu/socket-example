build-server:
	docker build -f Dockerfile.server -t peihsinsu/socket-web-example .

build-client:
	docker build -f Dockerfile.client -t peihsinsu/socket-client-example .

build-all: build-server build-client


run-server:
	docker run -d REDIS_SERVER=ts-db -p 3000:3000 peihsinsu/socket-web-example

run-client:
	docker run -d SOCKET_SERVER=http://ts-apserver:3000 -e TALK=true peihsinsu/socket-client-example


