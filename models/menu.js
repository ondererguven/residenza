var mongoose = require('mongoose');
var Dish = require('./dish');
var User = require('./user');

var menuSchema = mongoose.Schema({
    date: Date,
    type: String,
    firsts: [Dish],
    seconds: [Dish],
    sideDishes: [Dish],
    usersBooked: [Users],
    usersNotBooked: [Users]
});

var Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;