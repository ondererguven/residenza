var express = require('express');
var router = express.Router();

var Dish = require('../models/dish');


/*
 *  Get all the dishes ever saved
 */
router.get('/', function(req, res) {
    Dish.find(function(error, dishes) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Error with fetching the menus"
            });
        } else {
            res.status(200).json({
                error: null,
                message: "OK",
                data: dishes
            });
        }
    });
});


/*
 *  Get a specific dish
 */
router.get('/:dishId', function(req, res) {
    Dish.findById(req.params.dishId, function (error, dish) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Error with fetching the canteen"
            });
        } else {
            res.status(200).json({
                error: null,
                message: "OK",
                data: dish
            });
        }
    });
});


/*
 *  Like a dish, WIP we must check the user beforehand, permit stuff etc. 
 */
router.post('/like', function(req, res) {
    if (req.body.dishId) {
        Dish.findById(req.body.dishId, function(error, dish) {
            if (error) {
                res.status(500).json({
                    error: "someCode",
                    message: "Problem with fetching the dish"
                })
            } else {
                dish.userLikes.push(req.body.user);
                dish.save(function(error, newDish) {
                    if (error) {
                        res.status(500).json({
                            error: "someCode",
                            message: "Problem with saving the new data"
                        })
                    } else {
                        res.status(200).json({
                            error: null,
                            message: "OK",
                            data: newDish
                        });
                    }
                });
            }
        });
    } else {
        res.status(500).json({
            error: "someCode",
            message: "Please send the required data"
        });
    }
});


/*
 *  Add a new dish to the database
 */ 
router.post('/new', function(req, res) {
    if (req.body.name && req.body.description && req.body.imageURL) {
        var dish = new Dish({
            name: req.body.name,
            description: req.body.description,
            image: req.body.imageURL,
            userLikes: [],
            userNotLikes: []
        });
        dish.save();
        res.status(200).json({
            error: null,
            message: "OK",
            data: dish 
        });
    } else {
        res.status(500).json({
            error: "someCode",
            message: "Please send the correct data type"
        });
    }
});

module.exports = router;