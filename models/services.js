var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicesSchema = new Schema({
    availableServices: [{shuttle: Boolean, canteen: Boolean, laundry: Boolean}]
});

var Services = mongoose.model('Services', servicesSchema);

module.exports = Services;