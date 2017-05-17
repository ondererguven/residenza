var mongoose = require('mongoose');
var User = require('./user');

var dishSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String,
    userLikes: [User],
    userNotLikes: [User]
});