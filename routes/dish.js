var express = require('express');
var router = express.Router();

var oauth = require('../auth/oauth').oauth;
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
 *  Like a dish, WIP we must check the user beforehand, permit stuff etc
 *  Check if the user already liked the dish, if user disliked, remove from there and add in likes
 */
router.post('/like', oauth.authorise(),function(req, res) {
    if (req.body.dishId && req.user) {
        Dish.findById(req.body.dishId, function(error, dish) {
            if (error) {
                res.status(500).json({
                    error: "someCode",
                    message: "Error with fetching the dish"
                });
            } else {
                //Check if user already liked the dish
                var userLikeIndex = dish.userLikes.indexOf(req.user);
                if (userLikeIndex > -1) {
                    res.status(200).json({
                        error: null,
                        message: "User already liked"
                    });
                    return;
                }

                //Check if user already disliked the dish
                var userNotLikeIndex = dish.userNotLikes.indexOf(req.user);
                if (userLikeIndex > -1) {
                    dish.userNotLikes.splice(userNotLikeIndex, 1);
                    dish.userLikes.push(req.user);
                    dish.save(function(error) {
                        if (error) {
                            res.status(500).json({
                                error: null,
                                message: "Error saving the user"
                            });
                        } else {
                            res.status(200).json({
                                error: null,
                                message: "User already liked"
                            });
                        }
                        return;
                    });
                }
                
                //User was not found in any list, like dish
                dish.userLikes.push(req.user);
                dish.save(function(error){
                    if (error) {
                        res.status(500).json({
                            error: "somecode",
                            message: "Error with saving the user"
                        });
                    } else {
                        res.status(200).json({
                            error: null,
                            message: "User liked the dish"
                        });
                    }
                });
            }
        });
    } else {
        res.status(500).json({
            error: "someCode",
            message: "Please provide the required data"
        });
    }
});

/*
 *  Dislike a dish, WIP we must check the user beforehand, permit stuff etc
 *  Check if the user already disliked the dish, if user liked, remove from there and add in dislikes
 */
router.post('/dislike', function(req, res) {
    if (req.body.dishId) {
        Dish.findById(req.body.dishId, function(error, dish) {
            if (error) {
                res.status(500).json({
                    error: "someCode",
                    message: "Problem with fetching the dish"
                })
            } else {
                dish.userNotLikes.push(req.body.user);
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