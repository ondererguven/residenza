var mongoose = require('mongoose');

var shuttleTripSchema = mongoose.Schema({
    currentLocation: {lat: Number, lon: Number},
    schedule: [{lat: Number, lon: Number, time: Number, 
                order: Number, name: String, usersBooked: [{type: Schema.Types.ObjectId, ref: 'User'}]}],
    nextStop: Number,
    driver: {type: Schema.Types.ObjectId, ref: 'User'},
    //currentPassengers: ,
    delay: Boolean
});

var ShuttleTrip = mongoose.model('ShuttleTrip', shuttleTripSchema);

module.exports = ShuttleTrip;