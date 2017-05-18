var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
    name: String,
    description: String,
    image: String,
    userLikes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    userNotLikes: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

var Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;