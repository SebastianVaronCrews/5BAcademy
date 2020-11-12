
var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var middleware = require("../middleware");

//index route
router.get("/", middleware.isLoggedIn, function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var perPage = 5;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        Question.find({body:regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            Question.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("spanish/spanishClassroom", {
                        questions: allQuestions,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage)
                    });
                }
            });
        });
    } else {
  
        var perPage = 5;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        Question.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            Question.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("spanish/spanishClassroom", {
                        questions: allQuestions,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage)
                    });
                }
            });
        });
    }
});

   /* Question.find({}, function (err, questions) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("spanish/spanishClassroom", { questions: questions });
        }
    });
});*/
//new route
router.get("/ask", middleware.isLoggedIn, function (req, res) {
    Question.find({}, function (err, questions) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("spanish/ask", { questions: questions });
        }
    });
});
router.get("/notebook", middleware.isLoggedIn, function (req, res) {
    Question.find({}, function (err, questions) {
        if (err) {
            console.log("err");
        } else {
            res.render("spanish/notebook", { questions:questions });
        }
    });
});

//create route
router.post("/", middleware.isLoggedIn, function (req, res) {
    /*    var title = req.body.title;
        var question = req.body.question;
        var image = req.body.image
      
        var newQuestion = { title: title, question: question, image: image };*/
    req.body.Question.body = req.sanitize(req.body.Question.body)

    Question.create(req.body.Question, function (err, question) {
        if (err) {
            console.log(err);
        } else {
            question.author.id = req.user._id;
            question.author.username = req.user.username;
            //save comment
            question.save();
            res.redirect("/spanishClassroom");
        }
    });
});


//show route
router.get("/:id", middleware.isLoggedIn, function (req, res) {
    Question.findById(req.params.id).populate({ path:"likes", path: "comment", populate: { path: "likes" } }).exec(function (err, foundQuestion) {
        if (err) {
            res.redirect("/spanishClassroom");
        } else {
            res.render("spanish/show", { question: foundQuestion });
        }
    })
});

// Question Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Question.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            console.log(err);
            return res.redirect("/spanishClassroom");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundQuestion.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundQuestion.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundQuestion.likes.push(req.user);
        }

        foundQuestion.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/spanishClassroom");
            }
            return res.redirect("/spanishClassroom/" + foundQuestion._id);
        });
    });
});
/*
router.post("/:id/:comment_.id/like", middleware.isLoggedIn, function (req, res) {
    Question.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            console.log(err);
            return res.redirect("/spanishClassroom");
        }
        Comment.findById(req.params.id, function (err, foundComment) {
            if (err) {
                console.log(err);
                return res.redirect("/spanishClassroom");
            }

            // check if req.user._id exists in foundCampground.likes
            var foundCommentLike = foundComment.likes.some(function (like) {
                return like.equals(req.user._id);
            });

            if (foundUserLike) {
                // user already liked, removing like
                foundComment.likes.pull(req.user._id);
            } else {
                // adding the new user like
                foundComment.likes.push(req.user);
            }

            foundComment.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/spanishClassroom");
                }
                return res.redirect("/spanishClassroom/" + foundQuestion._id + foundComment._id);
            });
        });
    
});
*/



//Edit route
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkQuestionOwnership, function (req, res) {
    Question.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            res.redirect("/spanishClassroom");
        } else {
            res.render("edit", { question: foundQuestion });
        }
    })
});

//UPDATE ROUTE

router.put("/:id", middleware.isLoggedIn, middleware.checkQuestionOwnership, function (req, res) {
    req.body.Question.body = req.sanitize(req.body.Question.body)
    Question.findByIdAndUpdate(req.params.id, req.body.Question, function (err, updatedQuestion) {
        if (err) {
            res.redirect("/spanishClassroom");
        } else {
            res.redirect("/spanishClassroom/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, middleware.checkQuestionOwnership, function (req, res) {
    Question.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/spanishClassroom");
        } else {
            res.redirect("/spanishClassroom");
        }
    })
});


    

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


            module.exports = router;
