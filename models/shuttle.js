var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shuttleSchema = new Schema({
    serviceName: String,
    isActive: Boolean,
    trip: {type: Schema.Types.ObjectId, ref: 'ShuttleTrip'}
});
var Shuttle = mongoose.model('Shuttle', shuttleSchema);


var shuttleStopSchema = new Schema({
    coordinate: {lat: Number, lon: Number},
    time: String,
    address: String,
    name: String
});
var ShuttleStop = mongoose.model('ShuttleStop', shuttleStationSchema);


var shuttleTripSchema = new Schema({
    currentLocation: {lat: Number, lon: Number},
    schedule: [{type: Schema.Types.ObjectId, ref: 'Schedule'}],
    nextStop: Number,
    date: Date,
    driver: {type: Schema.Types.ObjectId, ref: 'OAuthUser'},
    usersBooked: [{type: Schema.Types.ObjectId, ref: 'OAuthUser'}],
    delay: Boolean
});
var ShuttleTrip = mongoose.model('ShuttleTrip', shuttleTripSchema);


var shuttleScheduleSchema = new Schema({
    stops: [[{type: Schema.Types.ObjectId, ref: 'ShuttleStop'}]],
    identifierCode: String //A for Monday to Friday, B for Saturday and C for Sunday.
});
var ShuttleSchedule = mongoose.model('ShuttleSchedule', shuttleScheduleSchema);


module.exports.Shuttle = Shuttle;
module.exports.ShuttleStop = ShuttleStop;
module.exports.ShuttleTrip = ShuttleTrip;
module.exports.ShuttleSchedule = ShuttleSchedule;