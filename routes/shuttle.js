var express = require('express');
var router = express.Router();

var Shuttle = require('../models/shuttle');
var ShuttleTrip = require('../models/shuttleTrip');

router.get('/', function(req, res, next) {
    var s = new Shuttle();
    s.save(function (err) {

    });
    Shuttle.find({}, function (err, docs) {
        res.send(docs);
    });
});

module.exports = router;