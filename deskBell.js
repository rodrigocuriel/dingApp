var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var Player = require('player');

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8110;

var router = express.Router();

router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if(err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
});

router.route('/bell')
    .post(function(req, res) {
        var player = new Player('./sounds/desk_bell.mp3');
	    player.play();
	    res.json({ message : 'playing sound since no Arduino found '});
    });

app.use('/', router);
app.listen(port);

console.log('dingApp listening ' + port);