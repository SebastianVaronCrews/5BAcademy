var mongoose = require("mongoose");
var questionSchema = new mongoose.Schema({
    question: String,
    body: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
});
module.exports = mongoose.model("Question", questionSchema);
