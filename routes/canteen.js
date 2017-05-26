var express = require('express');
var router = express.Router();

var Canteen = require('../models/canteen');
var Menu = require('../models/menu');
var Dish = require('../models/dish');


router.get('/', function(req, res) {
    Canteen.find(function(error, canteens) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Error with fetching the canteens"
            });
        } else {
            Canteen.populate(canteens, {path: 'menu', model: 'Menu', populate: {path:'dishes', model: 'Dish'}}, function(error, canteensPopulated) {
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: canteensPopulated
                });
            });
        }
    });
});

router.get('/:canteenId', function(req, res) {
    Canteen.findById(req.params.canteenId, function (error, canteen) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Error with fetching the canteen"
            });
        } else {
            Canteen.populate(canteen, {path: 'menu', model: 'Menu', populate: {path:'dishes', model: 'Dish'}}, function(error, canteenPopulated) {
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: canteenPopulated
                });
            });
        }
    });
});


/*
 *  Create a canteen with a menu
 * /
router.get('/create-canteen', function(req, res) {
    Menu.findOne(function(error, m) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "error fetching the menu"
            });
        } else {
            var canteen1 = new Canteen({
                serviceName: "Canteen",
                canteenName: "Mensa",
                position: {lat: 40.850068, lon: 14.294734},
                menu: m
            });
            canteen1.save();
        }
    });
});


/*
 *  Create three dishes and add those dishes in a menu
 * /

router.get('/create-dish-menu', function(req, res) {
    function addDish() {
        var promises = [];

        var pastaConTonno = new Dish({
            name: "Pasta con Tonno",
            type: "First",
            description: "Immigrant's favourite",
            image: "imageURL",
            userLikes: [],
            userDislike: []
        });
        promises.push(pastaConTonno.save());

        var risoAlSugo = new Dish({
            name: "Carne al Vino",
            type: "Second",
            description: "Meat cooked in vine",
            image: "imageURL",
            userLikes: [],
            userDislike: []
        });
        promises.push(risoAlSugo.save());

        var insalata = new Dish({
            name: "Insalata",
            type: "Side Dish",
            description: "Mista",
            image: "imageURL",
            userLikes: [],
            userDislike: []
        });
        promises.push(insalata.save());

        return promises;
    }

    function add() {
        Promise.all(addDish()).then(function(e0) {
            var today = new Date();
            var menu = new Menu({
                date: today,
                type: "Lunch",
                dishes: e0,
                usersBooked: [],
                usersNotBooked: []
            });
            return menu.save().then(function(l) {
                res.send('Done');
            }).catch(function(err){
                console.log(err);
            });
        });
    }

    add();
});
*/

module.exports = router;