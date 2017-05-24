var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Laundry = require('../models/laundry');
var Equipment = require('../models/equipment');

/*
 * Return all the laundries
 */
router.get('/', function(req, res) {
    Laundry.find(function(error, laundries) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong with fetching the laundries"
            });
        } else {
            Laundry.populate(laundries, {path: 'equipments', model: 'Equipment'}, function(error, laundriesPopulated){
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: laundriesPopulated 
                });
            });
        }
    });
});

/*
 * Return a specific laundry
 */
router.get('/:laundryId', function(req, res) {
    Laundry.findById(req.params.laundryId, function(error, laundry) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong with fetching the laundry"
            });
        } else {
            Laundry.populate(laundry, {path: 'equipments', model: 'Equipment'}, function(error, laundryPopulated){
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: laundryPopulated 
                });
            });
        }
    });
});

/*
 * Get all the equipments
 */ 
router.get('/equipment', function(req, res) {
    Equipment.find(function(error, equipments) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong with fetching the equipments"
            });
        } else {
            res.status(200).json({
                error: null,
                message: "OK",
                data: equipments
            });
        }
    });
});

/*
 * Get a specific equipment in a laundry
 */ 
router.get('/equipment/:equipmentId', function(req, res) {
    Equipment.findById(req.params.equipmentId, function(error, equipment) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong with fetching the equipment"
            });
        } else {
            res.status(200).json({
                error: null,
                message: "OK",
                data: equipment
            });
        }
    });
});

/*
 * Send a use request for a specific machine
 */ 
router.post('/equipment/book', function(req, res) {
    var equipmentId = req.body.equipmentId;
    var duration = req.body.duration;

    var t = new Date();

    Equipment.findByIdAndUpdate(equipmentId, { $set: {occupied: true, bookedTime: t, durationOfBooking: duration}}, {new: true}, function(error, equipment) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Problem with fetching the equipment"
            })
        } else {
            res.status(200).json({
                error: null,
                message: "OK",
                data: equipment
            });
        }
    });
});

/*
 * Create the laundry equipment
 
router.get('/create/laundry-equipment', function(req, res) {
    function createWashers() {
        var promises = [];

        var washer1 = new Equipment({
            type: "Washer", 
            order: 1, 
            broken: false, 
            occupied: false, 
            remainingTime: 0
        });
        promises.push(washer1.save());

        var washer2 = new Equipment({
            type: "Washer", 
            order: 2, 
            broken: false, 
            occupied: false, 
            remainingTime: 0
        });
        promises.push(washer2.save());

        var washer3 = new Equipment({
            type: "Washer", 
            order: 3, 
            broken: false, 
            occupied: false, 
            remainingTime: 0
        });
        promises.push(washer3.save());

        return promises;
    }

    function createDryers() {
        var promises = [];

        var dryer1 = new Equipment({
            type: "Dryer", 
            order: 1, 
            broken: false, 
            occupied: false, 
            remainingTime: 0
        });
        promises.push(dryer1.save());

        var dryer2 = new Equipment({
            type: "Dryer", 
            order: 2, 
            broken: false, 
            occupied: false, 
            remainingTime: 0
        });
        promises.push(dryer2.save());

        var dryer3 = new Equipment({
            type: "Dryer", 
            order: 3, 
            broken: false, 
            occupied: false, 
            remainingTime: 0
        });
        promises.push(dryer3.save());

        return promises;
    }

    function add() {
        Promise.all(createWashers()).then(function(e0) {
            Promise.all(createDryers()).then(function(e1) {
                var laundry = new Laundry({
                    serviceName: "Laundry",
                    equipments: e0.concat(e1)
                });
                return laundry.save().then(function(l) {
                    res.send('Done');
                }).catch(function(err){
                    console.log(err);
                });
            });
        });
    }

    add();
});
*/

module.exports = router;