var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shuttleSchema = new Schema({
    serviceName: String,
    isActive: Boolean,
    shuttleTrip: {type: Schema.Types.ObjectId, ref: 'ShuttleTrip'}
});

var Shuttle = mongoose.model('Shuttle', shuttleSchema);

module.exports = Shuttle;