var mongoose = require("mongoose");
var questionXSchema = new mongoose.Schema({
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
    commentX: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentX"
        },
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
});
module.exports = mongoose.model("QuestionX", questionXSchema);
