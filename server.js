let express = require('express')
let app = express()
let http = require('http').createServer(app)
let io = require('socket.io').listen(http)

app.use('/', express.static(__dirname + '/web'))

http.listen(3001)

io.sockets.on('connection', (socket) => {
    socket.on('draw', (data) => {
        socket.broadcast.emit('drawing', data)
    })
})
