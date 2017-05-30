var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var checkEquipments = require('./equipment').checkEquipments;

var Laundry = require('../models/laundry');
var Equipment = require('../models/equipment');

/*
 * Return all the laundries
 */
router.get('/', 
  checkEquipments(),
  function(req, res) {
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
router.get('/:id', 
  checkEquipments(),
  function(req, res) {
    Laundry.findById(req.params.id, function(error, laundry) {
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

module.exports = router;