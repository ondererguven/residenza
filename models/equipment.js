var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var equipmentSchema = new Schema({
    type: String, 
    order: Number, 
    status: Boolean, 
    occupied: Boolean, 
    remainingTime: Number
});

var Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;