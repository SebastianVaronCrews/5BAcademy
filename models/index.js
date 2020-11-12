var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb'://localhost/data-api');

    mongoose.Promise = Promise;

module.exports.Todo = require("./todo");
