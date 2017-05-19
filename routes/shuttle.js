var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Shuttle = require('../models/shuttle').Shuttle;
var Stop = require('../models/shuttle').ShuttleStop
var Trip = require('../models/shuttle').ShuttleTrip;
var Schedule = require('../models/shuttle').ShuttleSchedule

router.get('/', function(req, res, next) {
   
});


/*-------------------------------------------------*/
/*---------------------STOP------------------------*/
/*-------------------------------------------------*/

/*
 * Add a new stop
*/
router.post('/stop', function(req, res, next){
    var stop = new Stop({
        coordinate: {lat: req.body.lat, lon: req.body.lon},
        time: req.body.time,
        address: req.body.address,
        name: req.body.name
    });

    stop.save(function(err, stopSaved){
        if (err) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong saving the stop"
            });
        } else {
            res.status(200).json({
                error: null,
                message: "OK",
                data: stopSaved
            });
        }
    });
});


/*-------------------------------------------------*/
/*---------------------SHUTTLE---------------------*/
/*-------------------------------------------------*/

/*
 * Retrieve all the schedules
*/
router.get('/schedule', function(req, res, next){
    Schedule.find(function(err, schedules){
        if (err) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong fetching the schedules"
            });
        } else {
            Schedule.populate(schedules, {path: "stops", model: 'ShuttleStop'}, function(populateErr, schedulePopulated){
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: schedulePopulated
                });
            });            
        }
    });
});

/*
 * Add a new schedule
*/
router.post('/schedule', function(req, res, next){

    var idCode = req.body.idCode;
    var stops = [];
    
    for (var i = 0; i < req.body.stops.length; i++) {
         stops.push(mongoose.Types.ObjectId(req.body.stops[i]));
    }

    console.log(stops);

    var schedule = new Schedule({
        stops: [stops],
        identifierCode: 'A'
    });

    schedule.save(function(err, scheduleSaved){
        if (err) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong saving the schedule"
            });
        } else {
            res.status(200).json({
                error: null,
                message: "OK",
                data: scheduleSaved
            });
        }
    });

});



/*
 * Create the basic structure with one stop, one schedule with one stop, one trip
*/
router.get('/create-first-time', function(req, res){

    var stop1 = new Stop({
        coordinate: {lat: 40.850142, long: 14.294864},
        time: '07:30',
        address: "Residenza Parthenope",
        name: 'Residenza Parthenope'
    });

    stop1.save(function(err, savedStop){
        var schedule = new Schedule({
                stops: [[savedStop._id]],
                identifierCode: 'A'
            });
        schedule.save(function(err, savedSchedule){
            var trip = new Trip({
                    currentLocation: {lat: 40.855366, long: 14.283014},
                    schedule: [savedSchedule._id],
                    nextStop: 1,
                    date: new Date(),
                    delay: false
                });
            trip.save(function(err, savedTrip){
                var shuttle = new Shuttle({
                    serviceName: "Shuttle Service",
                    isActive: true,
                    trip: savedTrip._id
                });
                shuttle.save(function(err, shuttleSaved){
                    res.status(200).json({
                        err: null,
                        message: "DONE!"
                    });
                });
            });
        });
    });
});

module.exports = router;










// var stop1 = new stop({
    //     coordinate: {lat: 40.853644, long: 14.287845},
    //     time: String,
    //     address: String,
    //     name: String
    // });

    // var stop1 = new stop({
    //     coordinate: {lat: 40.850534, long: 14.275287},
    //     time: String,
    //     address: String,
    //     name: String
    // });

    // var stop1 = new stop({
    //     coordinate: {lat: 40.845225, long: 14.260778},
    //     time: String,
    //     address: String,
    //     name: String
    // });

    // var stop1 = new stop({
    //     coordinate: {lat: 40.837836, long: 14.249832},
    //     time: String,
    //     address: String,
    //     name: String
    // });

    // var stop1 = new stop({
    //     coordinate: {lat: 40.843879, long: 14.255998},
    //     time: String,
    //     address: String,
    //     name: String
    // });

    // var stop1 = new stop({
    //     coordinate: {lat: 40.854425, long: 14.273672},
    //     time: String,
    //     address: String,
    //     name: String
    // });

    // var stop1 = new stop({
    //     coordinate: {lat: 40.855366, long: 14.283014},
    //     time: String,
    //     address: String,
    //     name: String
    // });