var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Laundry = require('../models/laundry');
var Equipment = require('../models/equipment');

/*
 * Return the laundry object with an array of equipments for enthgfofhggo
 */
router.get('/', function(req, res, next) {

});

/*
 * Send a use request for a specific machine
 */ 
router.post('/:id/equipment/:equipmentId', function(req, res, next) {

});


/*
 * Create the laundry equipment
 
router.get('/create-laundry-equipment', function(req, res) {
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
                    console.log(l);
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