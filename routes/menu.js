var express = require('express');
var router = express.Router();

var Menu = require('../models/menu');
var Dish = require('../models/dish');

router.get('/', function(req, res) {
    Menu.find(function(error, menus) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Error with fetching the menus"
            });
        } else {
            Menu.populate(menus, {path:'firsts seconds sideDishes', model: 'Dish'}, function(error, menusPopulated) {
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: menusPopulated
                });
            });
        }
    });
});

router.get('/:menuId', function(req, res) {
    Menu.findById(req.params.menuId, function (error, menu) {
        if (error) {
            res.status(500).json({
                error: "someCode",
                message: "Error with fetching the canteen"
            });
        } else {
            Menu.populate(menu, {path:'firsts seconds sideDishes', model: 'Dish'}, function(error, menuPopulated) {
                res.status(200).json({
                    error: null,
                    message: "OK",
                    data: menuPopulated
                });
            });
        }
    });
});

router.post('/new', function(req, res) {
    if (req.body.type && req.body.firsts && req.body.seconds && req.body.sideDishes) {
        var today = new Date();
        var menu = new Menu({
            date: today,
            type: req.body.type,
            firsts: [req.body.firsts],
            seconds: [req.body.seconds],
            sideDishes: [req.body.sideDishes],
            usersBooked: [],
            usersNotBooked: []
        });
        menu.save();
        res.status(200).json({
            error: null,
            message: "OK",
            data: menu
        });
    } else {
        res.status(500).json({
            error: "someCode",
            message: "Please send the correct data type",
        });
    }
});

module.exports = router;