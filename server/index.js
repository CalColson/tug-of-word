require('dotenv').config()

const app = require('express')()
const port = 3000

const WebSocketServer = require('ws').WebSocketServer
const wsPort = 3001

const { initializeApp, applicationDefault } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ALLOWED_CORS_ORIGIN)
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.delete('/user/:uid', (req, res) => {
  const uid = req.params.uid
  // console.log(`deleting user ${uid}`)

  getAuth().deleteUser(uid).then(() => {
    console.log(`user ${uid} has been deleted`)
  }).catch(err => {
    console.log(err)
  })
})

app.listen(port, () => {
  console.log(`server listening at port ${port}`)
})

const wss = new WebSocketServer({ port: wsPort })

wss.on('connection', ws => {
  console.log('connection to server')
})
