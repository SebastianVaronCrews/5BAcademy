
var express = require("express");
var router = express.Router();
var QuestionM = require("../models/questionM");
var middleware = require("../middleware");

//index route
router.get("/", middleware.isLoggedIn, function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var perPage = 5;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        QuestionM.find({body:regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            QuestionM.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("math/mathClassroom", {
                        questionsM: allQuestions,
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
        QuestionM.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            QuestionM.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("math/mathClassroom", {
                        questionsM: allQuestions,
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
    QuestionM.find({}, function (err, questionsM) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("math/ask", { questionsM: questionsM });
        }
    });
});

router.get("/notebook", middleware.isLoggedIn, function (req, res) {
    QuestionM.find({}, function (err, questionsM) {
        if (err) {
            console.log("err");
        } else {
            res.render("math/notebook", { questionsM: questionsM });
        }
    });
});

//create route
router.post("/", middleware.isLoggedIn, function (req, res) {
    /*    var title = req.body.title;
        var question = req.body.question;
        var image = req.body.image
      
        var newQuestion = { title: title, question: question, image: image };*/
    req.body.QuestionM.body = req.sanitize(req.body.QuestionM.body)

    QuestionM.create(req.body.QuestionM, function (err, questionM) {
        if (err) {
            console.log(err);
        } else {
            questionM.author.id = req.user._id;
            questionM.author.username = req.user.username;
            //save comment
            questionM.save();
            res.redirect("/mathClassroom");
        }
    });
});


//show route
router.get("/:id", middleware.isLoggedIn, function (req, res) {
    QuestionM.findById(req.params.id).populate({ path:"likes", path: "commentM", populate: { path: "likes" } }).exec(function (err, foundQuestion) {
        if (err) {
            res.redirect("/mathClassroom");
        } else {
            res.render("math/show", { questionM: foundQuestion });
        }
    })
});

// Question Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    QuestionM.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            console.log(err);
            return res.redirect("/mathClassroom");
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
                return res.redirect("/mathClassroom");
            }
            return res.redirect("/mathClassroom/" + foundQuestion._id);
        });
    });
});



//Edit route
router.get("/:id/editM", middleware.isLoggedIn, middleware.checkQuestionMOwnership, function (req, res) {
    QuestionM.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            res.redirect("/mathClassroom");
        } else {
            res.render("editM", { questionM: foundQuestion });
        }
    })
});

//UPDATE ROUTE

router.put("/:id", middleware.isLoggedIn, middleware.checkQuestionMOwnership, function (req, res) {
    req.body.QuestionM.body = req.sanitize(req.body.QuestionM.body)
    QuestionM.findByIdAndUpdate(req.params.id, req.body.QuestionM, function (err, updatedQuestion) {
        if (err) {
            res.redirect("/mathClassroom");
        } else {
            res.redirect("/mathClassroom/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, middleware.checkQuestionMOwnership, function (req, res) {
    QuestionM.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/mathClassroom");
        } else {
            res.redirect("/mathClassroom");
        }
    })
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


            module.exports = router;
