var mongoose = require('mongoose');

var laundrySchema = mongoose.Schema({
    serviceName: String,
    equipment = [{type: String, order: Number, status: Boolean, 
                  occupied: Boolean, remainingTime: Number}]
});

var Laundry = mongoose.model('Laundry', laundrySchema);

module.exports = Laundry;