var mongoose = require('mongoose');

var servicesSchema = mongoose.Schema({
    availableServices: [{shuttle: Boolean, canteen: Boolean, laundry: Boolean}]
});

var Services = mongoose.model('Services', servicesSchema);

module.exports = Services;