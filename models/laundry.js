var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var laundrySchema = new Schema({
    serviceName: String,
    equipments: [{type: Schema.Types.ObjectId, ref: 'Equipment'}]
});

var Laundry = mongoose.model('Laundry', laundrySchema);

module.exports = Laundry;