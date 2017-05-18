var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var laundrySchema = new Schema({
    serviceName: String,
    equipment = [{type: String, order: Number, status: Boolean, 
                  occupied: Boolean, remainingTime: Number}]
});

var Laundry = mongoose.model('Laundry', laundrySchema);

module.exports = Laundry;