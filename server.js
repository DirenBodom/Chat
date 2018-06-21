var express = require('express')
var app = express()
var http = require('http').Server(app)
var bodyParser = require('body-parser')

// It's harder to set up socket.io because it needs to be tied to express
/*
 * The plan is to create an HTTP server with node that we'll then share with express
 * and socket.io
 */
var io = require('socket.io')(http)
app.use(express.static(__dirname))

// This lets body parser know that we expect json to be coming in.
app.use(bodyParser.json())
// The input from our html is url-encoded, so set up body-parser to support that
app.use(bodyParser.urlencoded({extended: false}))

var messages = [
    { name: 'Tim', message: 'Hi' },
    { name: 'Jane', message: 'Hello' }
]

app.get('/messages', (req, res) => {
    res.send(messages)
})

// Create a new message post endpoint

app.post('/messages', (req, res) => {
    // Let's the client know send was successful
    res.sendStatus(200)
    // See what data we get in our body
    console.log(req.body)
    // Add the message from post man
    messages.push(req.body)
    /*
     * Emit an event from the server to all clients
     * notifying them of a new message
     */
    io.emit('message', req.body)    // req.body is the message
})
// Call-back function for the socket connection event, to know when a new user is on
io.on('connection', () => {
    console.log('New user has joined')
})
/*
 * We can't serve our backend server with just express any longer
 * We will use the node http server, so that both Express and socket.io will be running
 */
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})