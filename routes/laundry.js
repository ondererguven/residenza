var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Laundry = require('../models/laundry');
var Equipment = require('../models/equipment');

/*
 * Return all the laundries
 */
router.get('/', function(req, res, next) {
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
router.get('/:laundryId', function(req, res, next) {
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
 * Get a specific equipment in a laundry
 */ 
router.get('/:laundryId/equipment/:equipmentId', function(req, res, next) {
    var requestedEquipment;
    Laundry.findById(req.params.laundryId, function(error, laundry) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Something went wrong with fetching the laundry" 
            });
        } else {
            Laundry.populate(laundry, {path: 'equipments', model: 'Equipment'}, function(error, laundryPopulated) {
                var allEquipments = laundryPopulated.equipments;
                for (var i = 0; i < allEquipments.length; i++) {
                    if (allEquipments[i].id == req.params.equipmentId) {
                        requestedEquipment = allEquipments[i];
                    }
                }
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: requestedEquipment
                });
            });
        }
    });
});

/*
 * Send a use request for a specific machine
 */ 
router.post('/:laundryId/equipment/:equipmentId', function(req, res, next) {

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