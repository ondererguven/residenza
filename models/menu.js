var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    date: Date,
    type: String,
    firsts: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
    seconds: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
    sideDishes: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
    usersBooked: [{type: Schema.Types.ObjectId, ref: 'User'}],
    usersNotBooked: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

var Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;