var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var equipmentSchema = new Schema({
    type: String, 
    order: Number, 
    broken: Boolean, 
    occupied: Boolean,
    bookedTime: Date, 
    durationOfBooking: Number
});

var Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;