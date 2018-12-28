var ws = require("nodejs-websocket")
var name = 1
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.nickName = 'user' + name
    name ++
    conn.on("text", function (str) {
        let msg = JSON.parse(str)
        if (msg.type === 'enter') {
            msg.name = conn.nickName
            senMessage(JSON.stringify(msg))
        } else {
            senMessage(JSON.stringify(msg))
        }
    })
    conn.on("close", function (code, reason) {
        let msg = {
            type: 'leave',
            msg: '',
            name: conn.nickName,
        }
        senMessage(JSON.stringify(msg))
        console.log("Connection closed", code, reason, conn)
    })
    conn.on('error', (errObj) => {
        console.log(errObj)
    })
}).listen(8001)

const senMessage = str => {
    server.connections.forEach((connection) => {
        connection.sendText(str)
    })
}
