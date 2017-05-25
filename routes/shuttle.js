var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var oauth = require('../auth/oauth').oauth;
var permit = require('../auth/oauth').permit;

var Shuttle = require('../models/shuttle').Shuttle;
var Stop = require('../models/shuttle').ShuttleStop;
var Trip = require('../models/shuttle').ShuttleTrip;
var Schedule = require('../models/shuttle').ShuttleSchedule;

/*
 *  Get shuttle information
 */ 
router.get('/', function(req, res, next) {
    Shuttle.find(function(error, shuttles) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong with fetching the shuttle"
            });
        } else {
            Shuttle.populate(shuttles, {path: 'trip', model: "ShuttleTrip", populate: {path: 'stops', model: "ShuttleStop"}}, function(error, shuttlesPopulated) {
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: shuttlesPopulated
                });
            });
        }
    });
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

    stop.save(function(error, stopSaved){
        if (error) {
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
    Schedule.find(function(error, schedules){
        if (error) {
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
 * Retrieve all shuttle positions
*/
router.get('/positions', function(req, res){
    var positions = [];
    Shuttle.find({isActive: true}, function(error, shuttles){
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong fetching the schedules"
            });
        } else {
            Shuttle.populate(shuttles, {path: "trip", model: 'ShuttleTrip'}, function(populateErr, shuttlesPopulated){
                for (var i = 0; i < shuttlesPopulated.length; i++) {
                    var s = shuttlesPopulated[i];
                    positions.push(s.id);
                    positions.push(s.trip.currentLocation);
                }
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: positions
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

    schedule.save(function(error, scheduleSaved){
        if (error) {
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
 * Start a new trip     WIP STILL NEEDS IMPLEMENTATION
*/
router.post('/trip', 
  oauth.authorise(), 
  permit('driver'), 
  function(req, res, next) {
    var dayIdentifier;
    var today = new Date();
    var currentDay = today.getDay(); // From Sunday 0 to Saturday 6
    var currentHour = today.getHours(); // 0 to 23
    switch (currentDay) {
        case 0:
            dayIdentifier = 'C';
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            dayIdentifier = 'A';
            break;
        case 6:
            dayIdentifier = 'B';
            break;
        default:
            res.status(500).json({
                error: "someCode",
                message: "Couldn't catch the day"
            });
            break;
    }
    var availableSchedules = [];
    Schedule.find({'identifierCode': dayIdentifier}, function(error, schedules) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong fetching the schedules"
            });
        } else {
            Schedule.populate(schedules, {path: 'stops', model: 'ShuttleStop'}, function(error, schedulesPopulated) {
                if (error) {
                    res.status(500).json({
                        error: "someCode",
                        message: "Couldn't populate the schedules"
                    });
                } else {
                    for (var i = 0; i < schedulesPopulated[0].stops.length; i++) {
                        var startingHour = schedulesPopulated[0].stops[i][0].time.substring(0,2);
                        var startingHourAsNumber = Number(startingHour);
                        if (startingHourAsNumber >= currentHour) {
                            availableSchedules.push(schedulesPopulated[0].stops[i]);c 
                        }
                    }
                    res.status(200).json({
                        error: null,
                        message: "OK",
                        data: availableSchedules
                    });
                }
            });
        }
    });
});

router.post('/cur-loc', function(req, res){
    console.log(req.body);
    Trip.findOne().then(function(trip){
        trip.currentLocation.lat = req.body.latitude;
        trip.currentLocation.lon = req.body.longitude;
        trip.save().then(function(tripSaved){
            res.status(200).json({err: false, message: tripSaved});
        }); 
    });
});

router.get('/cur-loc', function(req, res){
    Trip.findOne().then(function(trip){
        res.status(200).json({err: false, message: trip});
    });
    
});

/*
 * Create the basic structure with all the stops and the three schedules. Call BEFORE '/create-trip-shuttle'.

router.get('/create-stop-schedule', function(req, res){

    function addStopsA(hours){

        var promises = [];
        var ferraris1 = new Stop({
            coordinate: {lat: 40.850142, lon: 14.294864},
            time: hours[0],
            address: "Via Ferraris, 273",
            name: 'Residenza Parthenope'
        });
        promises.push(ferraris1.save());

        var gianturco1 = new Stop({
            coordinate: {lat: 40.853644, lon: 14.287845},
            time: hours[1],
            address: 'Via Gianturco',
            name: 'Gianturco'
        });
        promises.push(gianturco1.save());

        var inps1 = new Stop({
            coordinate: {lat: 40.850534, lon: 14.275287},
            time: hours[2],
            address: 'Via Ferraris, sede INPS',
            name: 'INPS'
        });
        promises.push(inps1.save());

        var nuovaMarina1 = new Stop({
            coordinate: {lat: 40.845225, lon: 14.260778},
            time: hours[3],
            address: 'Via Nuova Marina, 59',
            name: 'Nuova Marina'
        });
        promises.push(nuovaMarina1.save());

        var sanCarlo1 = new Stop({
            coordinate: {lat: 40.837836, lon: 14.249832},
            time: hours[4],
            address: 'Via S. Carlo, 98',
            name: 'San Carlo'
        });
        promises.push(sanCarlo1.save());

        var borsa1 = new Stop({
            coordinate: {lat: 40.843879, lon: 14.255998},
            time: hours[5],
            address: 'Piazza Borsa',
            name: 'Piazza Borsa'
        });
        promises.push(borsa1.save());

        var galleria1 = new Stop({
            coordinate: {lat: 40.854425, lon: 14.273672},
            time: hours[6],
            address: 'Corso Meridionale, 42',
            name: 'Galleria'
        });
        promises.push(galleria1.save());

        var sessa1 = new Stop({
            coordinate: {lat: 40.855366, lon: 14.283014},
            time: hours[7],
            address: 'Via Taddeo Sessa',
            name: 'Sessa'
        });
        promises.push(sessa1.save());

        var gianturco12 = new Stop({
            coordinate: {lat: 40.853644, lon: 14.287845},
            time: hours[8],
            address: 'Via Gianturco',
            name: 'Gianturco'
        });
        promises.push(gianturco12.save());

        var ferraris12 = new Stop({
            coordinate: {lat: 40.850142, lon: 14.294864},
            time: hours[9],
            address: "Via Ferraris, 273",
            name: 'Residenza Parthenope'
        });
        promises.push(ferraris12.save());

        return promises;
    }

    function addStopsBC(hoursAndCode){

        var promises = [];
        var ferraris1 = new Stop({
            coordinate: {lat: 40.850142, lon: 14.294864},
            time: hoursAndCode[0],
            address: "Via Ferraris, 273",
            name: 'Residenza Parthenope'
        });
        promises.push(ferraris1.save());

        var inps1 = new Stop({
            coordinate: {lat: 40.850534, lon: 14.275287},
            time: hoursAndCode[1],
            address: 'Via Ferraris, sede INPS',
            name: 'INPS'
        });
        promises.push(inps1.save());

        var ferraris12 = new Stop({
            coordinate: {lat: 40.850142, lon: 14.294864},
            time: hoursAndCode[2],
            address: "Via Ferraris, 273",
            name: 'Residenza Parthenope'
        });
        promises.push(ferraris12.save());
        
        return promises;
    }

    function addA() {
        var hours = [];

        hours.push(['07:30','07:35','07:40','07:50','07:55','08:00','08:10','08:15','08:17','08:20']);
        hours.push(['08:50','08:55','09:00','09:10','09:15','09:20','09:30','09:35','09:37','09:40']);
        hours.push(['11:15','11:20','11:30','11:40','11:45','11:50','12:00','12:05','12:07','12:10']);
        hours.push(['13:15','13:20','13:30','13:40','13:45','13:50','14:00','14:05','14:07','14:10']);
        hours.push(['15:00','15:05','15:15','15:25','15:30','15:35','15:45','15:50','15:52','15:55']);
        hours.push(['16:35','16:40','16:50','17:00','17:05','17:10','17:20','17:25','17:27','17:30']);
        hours.push(['18:15','18:20','18:30','18:40','18:45','18:50','19:00','19:05','19:07','19:12']);
        hours.push(['20:00','20:05','20:15','20:25','20:30','20:35','20:45','20:50','20:52','20:57']);

        Promise.all(addStopsA(hours[0])).then(function(s0){
            Promise.all(addStopsA(hours[1])).then(function(s1){
                Promise.all(addStopsA(hours[2])).then(function(s2){
                    Promise.all(addStopsA(hours[3])).then(function(s3){
                        Promise.all(addStopsA(hours[4])).then(function(s4){
                            Promise.all(addStopsA(hours[5])).then(function(s5){
                                Promise.all(addStopsA(hours[6])).then(function(s6){
                                    Promise.all(addStopsA(hours[7])).then(function(s7){
                                        var schedule = new Schedule({
                                            stops: [s0,s1,s2, s3,s4,s5,s6,s7],
                                            identifierCode: 'A'
                                        });
                                        return schedule.save();
                                        // schedule.save(function(response){
                                        //     console.log('A done!')
                                        // });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    function addB() {
        var hours = [];

        hours.push(['07:00', '07:20', '07:40']);
        hours.push(['08:00', '08:20', '08:40']);
        hours.push(['09:00', '09:20', '09:40']);
        hours.push(['10:00', '10:20', '10:40']);
        hours.push(['11:00', '11:20', '11:40']);
        hours.push(['12:00', '12:20', '12:40']);

        Promise.all(addStopsBC(hours[0])).then(function(s0){
            Promise.all(addStopsBC(hours[1])).then(function(s1){
                Promise.all(addStopsBC(hours[2])).then(function(s2){
                    Promise.all(addStopsBC(hours[3])).then(function(s3){
                        Promise.all(addStopsBC(hours[4])).then(function(s4){
                            Promise.all(addStopsBC(hours[5])).then(function(s5){
                                var schedule = new Schedule({
                                    stops: [s0,s1,s2, s3,s4,s5],
                                    identifierCode: 'B'
                                });
                                return schedule.save();
                                // schedule.save(function(response){
                                //     console.log('B done!')
                                // });
                            });
                        });
                    });
                });
            });
        });
    }

    function addC() {
        var hours = [];

        hours.push(['16:00', '16:20', '16:40']);
        hours.push(['17:00', '17:20', '17:40']);
        hours.push(['18:00', '18:20', '18:40']);
        hours.push(['19:00', '19:20', '19:40']);
        hours.push(['20:00', '20:20', '20:40']);

        Promise.all(addStopsBC(hours[0])).then(function(s0){
            Promise.all(addStopsBC(hours[1])).then(function(s1){
                Promise.all(addStopsBC(hours[2])).then(function(s2){
                    Promise.all(addStopsBC(hours[3])).then(function(s3){
                        Promise.all(addStopsBC(hours[4])).then(function(s4){
                            var schedule = new Schedule({
                                stops: [s0,s1,s2, s3,s4],
                                identifierCode: 'C'
                            });
                            return schedule.save();
                            // schedule.save(function(response){
                            //     console.log('C done!')
                            // });
                        });
                    });
                });
            });
        });
    }

    var scheduleA = addA();
    var scheduleB = addB();
    var scheduleC = addC();

    Promise.all([scheduleA, scheduleB, scheduleC]).then(function(response){
        res.status(200).json({
            err: null,
            message: "DONE!"
        });   
    });
});


/*
 * Create the basic structure with a trip and the shuttle. Call AFTER '/create-stop-schedule'.  

router.get('/create-trip-shuttle', function(req, res){
    Schedule.find({identifierCode: 'B'}).then(function(schedule){
        var trip = new Trip({
            currentLocation: {lat: 40.855366, lon: 14.283014},
            stops: schedule[0].stops[0],
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
*/



module.exports = router;