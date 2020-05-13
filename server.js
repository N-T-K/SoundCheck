var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);
var myLogStatement = function(req, res, next) {
    console.log("Received", req.method, "request for resource", req.path, "from", req.ip);
    next(); // callback to the middleware function
}
let clientList = new Map();
var levelLogArr = [];

app.use(myLogStatement);

app.use(express.static('src'));

httpServer.listen(3000, function(){
    console.log("Listening on port 3000");
});

var numClients = 0;
io.on('connection', function(socket) {
    let foundSocket = clientList.get(socket.ipAddress);
    if (foundSocket === undefined) {
        foundSocket = socket; //new socket
        clientList.set(socket.ipAddress, socket);
        console.log('New client', numClients++, 'connected.'); //newsocket
    }
    socket.emit('update log arr', levelLogArr); // catch the client up

    //socket.emit('message', 'connected');
    socket.on('join', function(data){
        console.log('Client: ' + socket.id + " msg:" + data);
        });
    // socket.on("chat", function(msg) {
    //     console.log("Client: " + socket.id + "message: " + msg);
    //     socket.broadcast.emit('chat msg', msg);
    //     });
});

let level = 0;
let mode = 'up';
function updateLevel() {
    level = Math.round(Math.random() * 100);
    // if(level === 100 || (level === 0 && mode ==='down')) {
    //     if(mode === 'up') {
    //         mode = 'down'
    //     } else {
    //         mode = 'up'
    //     }
    // }
    // if(mode === 'up') {
    //     level += 1;
    // } else {
    //     level -= 1;
    // }
    io.sockets.emit('update level', level);
    if(level >= 95) { // update log if the level exceeds the threshold
        let d = new Date();
        let peakStr = d.toLocaleDateString() + " " + d.toLocaleTimeString() + ": " + level;
        levelLogArr.push(peakStr);
        io.sockets.emit('update log', peakStr);
    }
    if(levelLogArr.length > 500) {
        for(let i = 0; i < 100; i++) {
            levelLogArr.pop(); //don't let this array grow to large
        }
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

let simLevel = async () => {
    while(true) {
        updateLevel();
        await sleep(100); // don't put too much strain on CPU
    }
}
simLevel();
