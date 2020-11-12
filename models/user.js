var mongoose = require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: { type: String, unique: true, lowercase: true },
    customerToken: String,
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    isAdmin: {type: Boolean, default: false}
   
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
