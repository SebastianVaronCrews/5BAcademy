var mongoose = require("mongoose");
var questionMSchema = new mongoose.Schema({
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
    commentM: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentM"
        },
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
});
module.exports = mongoose.model("QuestionM", questionMSchema);
