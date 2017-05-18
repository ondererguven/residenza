var express = require('express');
var router = express.Router();

var Shuttle = require('../models/shuttle');
var ShuttleTrip = require('../models/shuttleTrip');

router.get('/', function(req, res, next) {
    var s = new Shuttle();
    s.serviceName = "Shuttle";
    s.isActive = true;
    s.save(function (err, shuttle) {
        res.send(shuttle);
    });
});

module.exports = router;