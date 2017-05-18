var mongoose = require('mongoose');
var Menu = require('./menu');

var canteenSchema = mongoose.Schema({
    serviceName: String,
    menu: [Menu],
    canteenName: String,
    position: {lat: Number, lon: Number}
});

var Canteen = mongoose.model('Canteen', canteenSchema);

module.exports = Canteen;