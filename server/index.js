const WebSocketServer = require('ws').WebSocketServer

const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', ws => {
  console.log('connection to server')
})
