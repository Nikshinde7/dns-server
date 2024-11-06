import * as dgram from "dgram";

const server: dgram.Socket = dgram.createSocket('udp4');

server.on('message', (msg, remoteInfo) => {
    console.log('Incoming Message', msg.toString())
})

server.bind(2053, "127.0.0.1", () => {
    console.log("Server is up and running at port 53")
})