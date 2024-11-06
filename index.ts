import * as dgram from "dgram";
import * as dpacket from "dns-packet"

const server: dgram.Socket = dgram.createSocket('udp4');

// This is just a basic DB implementation to mimic the DNS behaviour
const db: any = {
    "nikshinde.dev": {
        type: "A",
        data: "1.2.3.4"
    },
    "gear.nikshinde.dev": {
        type: "A",
        data: "4.5.6.7"
    }
}

/*
 The msg we get here comes in binary format
 and the second parameter which is remoteInfo, provides info about who queried the DNS
*/
server.on('message', (msg, remoteInfo) => {
    const incomingReq: dpacket.DecodedPacket = dpacket.decode(msg)

    if(!incomingReq.questions) return ''

    const ipFromDb = db[incomingReq.questions[0].name];

    const answer = dpacket.encode({
        id: incomingReq.id,
        type: 'response',
        flags: dpacket.AUTHORITATIVE_ANSWER,
        questions: incomingReq.questions,
        answers: [{
            type: ipFromDb.type,
            class: "IN",
            name: incomingReq.questions[0].name,
            data: ipFromDb.data
        }] 
    });

    server.send(answer, remoteInfo.port, remoteInfo.address)
})

server.bind(2053, "127.0.0.1", () => {
    console.log("Server is up and running at port 53")
})