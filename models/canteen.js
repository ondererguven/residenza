var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var canteenSchema = new Schema({
    serviceName: String,
    menu: [{type: Schema.Types.ObjectId, ref: 'Menu'}],
    canteenName: String,
    position: {lat: Number, lon: Number}
});

var Canteen = mongoose.model('Canteen', canteenSchema);

module.exports = Canteen;