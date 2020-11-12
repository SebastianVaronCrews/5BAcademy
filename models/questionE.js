var mongoose = require("mongoose");
var questionESchema = new mongoose.Schema({
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
    commentE: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentE"
        },
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
});
module.exports = mongoose.model("QuestionE", questionESchema);
