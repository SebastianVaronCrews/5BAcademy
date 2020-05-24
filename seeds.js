var mongoose = require("mongoose");
var Question = require("./models/question");
var Comment = require("./models/comment");

var data = [
    {
        question: "como se ?",
        body: "detalles?",
        author: "goodboy"
    },
    {
        question: "ahora se ?",
        body: "detalles?",
        author: "Severus"
    },
    {
        question: "donde se ?",
        body: "detalles?",
        author: "Severus"
    },

]

function seedDB() {
    Question.remove({}, function (err) {
      /*  if (err) {
            console.log(err);
        }
        console.log("removed question!");
        data.forEach(function (seed) {
            Question.create(seed, function (err, questiol) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("added a question");
                    Comment.create(
                        {
                            text: "tengo la misma pregunta",
                            author: "homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                questiol.comments.push(comment);
                                questiol.save();
                                console.log("Created New Comment");
                            }
                        });
                }
            });
        });*/
    });
}

module.exports = seedDB;