var mongoose = require('mongoose');

var shuttleSchema = mongoose.Schema({
    serviceName: String,
    currentLocation: {lat: Number, lon: Number},
    schedule: [{lat: Number, lon: Number, time: Number, 
                order: Number, name: String}],
    nextStop: Number,
    delay: Boolean
});

var Shuttle = mongoose.model('Shuttle', shuttleSchema);

module.exports = Shuttle;