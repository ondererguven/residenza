var mongoose = require('mongoose');

var dishSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String,
    userLikes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    userNotLikes: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

var Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;