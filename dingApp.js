// initialize everything, web server, socket.io, filesystem, johnny-five
var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs'),
  five = require("johnny-five"),
  board, led, solenoid;

board = new five.Board();

// on board ready
board.on("ready", function() {
  solenoid = new five.Led(2);
  led = new five.Led(8).strobe(1000);
});

// make web server listen on port 80
app.listen(8110);


// handle web server
function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}


// on a socket connection
io.sockets.on('connection', function(socket) {
  socket.emit('news', {
    hello: 'world'
  });

  // if servo message received
  socket.on('solenoid', function(data) {
    console.log("Code Review !!");
    if (board.isReady) {
      solenoid.on();
      setTimeout(function (){
        solenoid.off();
      }, data.delay);
    }
  });
  // if led message received
  socket.on('led', function(data) {
    console.log("Changing LED strobe delay to", data.delay);
    if (board.isReady) {
      led.strobe(data.delay);
    }
  });

});