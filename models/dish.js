var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishSchema = new Schema({
    name: String,
    type: String,
    description: String,
    image: String,
    userLikes: [{type: Schema.Types.ObjectId, ref: 'OAuthUser'}],
    userNotLikes: [{type: Schema.Types.ObjectId, ref: 'OAuthUser'}]
});

var Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;