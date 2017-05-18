var mongoose = require('mongoose');

var shuttleSchema = mongoose.Schema({
    serviceName: String,
    isActive: Boolean,
    shuttleTrip: {type: Schema.Types.ObjectId, ref: 'ShuttleTrip'}
});

var Shuttle = mongoose.model('Shuttle', shuttleSchema);

module.exports = Shuttle;