var mongoose = require('mongoose');

var canteenSchema = mongoose.Schema({
    serviceName: String,
    menu: [{type: Schema.Types.ObjectId, ref: 'Menu'}],
    canteenName: String,
    position: {lat: Number, lon: Number}
});

var Canteen = mongoose.model('Canteen', canteenSchema);

module.exports = Canteen;