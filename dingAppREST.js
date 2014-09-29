var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var five = require("johnny-five");
var arduinoBoard = new five.Board();
var ledPIN = {};
var bellPIN = {};

arduinoBoard.on("ready", function() {
    bellPIN = new five.Led(2);
    ledPIN = new five.Led(8).strobe(1000);
});
arduinoBoard.on("error", function() {
    console.log('error connecting with Arduino');
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
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:<PORT>/dingApp)
router.get('/', function(req, res) {
    res.json({ message : 'hooray! welcome to Code Review!' });
});

// create a POST (accessed at POST http://localhost:<PORT>/dingApp/bell)
router.route('/bell')
    .post(function(req, res) {
        console.log('Bell delay', req.body.delay);
        if(arduinoBoard.isReady) {
            bellPIN.on();
            setTimeout(function() {
                bellPIN.off();
            }, req.body.delay);
            res.json({ message : 'delay for bell: ' + req.body.delay });
        } else {
            res.json({ message : 'delay for bell: ' + req.body.delay });
        }
    });

router.route('/led')
    .post(function(req, res) {
        console.log('LED strobe delay', req.body.delay);
        if(arduinoBoard.isReady) {
            ledPIN.strobe(req.body.delay);
            res.json({ message : 'delay for LED strobe: ' + req.body.delay });
        } else {
            res.json({ message : 'delay for LED strobe: ' + req.body.delay });
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