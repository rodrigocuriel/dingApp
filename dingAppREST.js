// server.js
// BASE SETUP
// =============================================================================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var five = require("johnny-five");
var arduinoBoard = new five.Board();
var ledPIN = {};
var bellPIN = {};

// on board ready
arduinoBoard.on("ready", function() {
    bellPIN = new five.Led(2);
    ledPIN = new five.Led(8).strobe(1000);
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8110; 		// set our port

// ROUTES FOR OUR DING API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/dingApp)
router.get('/', function(req, res) {
    res.json({ message : 'hooray! welcome to Code Review!' });
});

router.route('/bell')

    // create a POST (accessed at POST http://localhost:8110/dingApp/bell)
    .post(function(req, res) {
        if(arduinoBoard.isReady) {
            bellPIN.on();
            setTimeout(function() {
                bellPIN.off();
            }, req.body.delay);
            res.json({ message : 'Bell dinged!' });
        }
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /dingApp
app.use('/dingApp', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('dingApp listening ' + port);