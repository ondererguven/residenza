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

module.exports = router;