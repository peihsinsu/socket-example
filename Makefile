build-server:
	docker build -f Dockerfile.server -t peihsinsu/socket-web-example .

build-client:
	docker build -f Dockerfile.client -t peihsinsu/socket-client-example .

build-all: build-server build-client
