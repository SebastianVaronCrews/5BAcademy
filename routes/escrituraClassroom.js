
var express = require("express");
var router = express.Router();
var QuestionX = require("../models/questionX");
var middleware = require("../middleware");

//index route
router.get("/", middleware.isLoggedIn, function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var perPage = 5;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        QuestionX.find({body:regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            QuestionX.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("escritura/escrituraClassroom", {
                        questionsX: allQuestions,
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
        QuestionX.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            QuestionX.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("escritura/escrituraClassroom", {
                        questionsX: allQuestions,
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
    QuestionX.find({}, function (err, questionsX) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("escritura/ask", { questionsX: questionsX });
        }
    });
});

router.get("/notebook", middleware.isLoggedIn, function (req, res) {
    QuestionX.find({}, function (err, questionsX) {
        if (err) {
            console.log("err");
        } else {
            res.render("escritura/notebook", { questionsX: questionsX });
        }
    });
});
//create route
router.post("/", middleware.isLoggedIn, function (req, res) {
    /*    var title = req.body.title;
        var question = req.body.question;
        var image = req.body.image
      
        var newQuestion = { title: title, question: question, image: image };*/
    req.body.QuestionX.body = req.sanitize(req.body.QuestionX.body)

    QuestionX.create(req.body.QuestionX, function (err, questionX) {
        if (err) {
            console.log(err);
        } else {
            questionX.author.id = req.user._id;
            questionX.author.username = req.user.username;
            //save comment
            questionX.save();
            res.redirect("/escrituraClassroom");
        }
    });
});


//show route
router.get("/:id", middleware.isLoggedIn, function (req, res) {
    QuestionX.findById(req.params.id).populate({ path:"likes", path: "commentX", populate: { path: "likes" } }).exec(function (err, foundQuestion) {
        if (err) {
            res.redirect("/escrituraClassroom");
        } else {
            res.render("escritura/show", { questionX: foundQuestion });
        }
    })
});

// Question Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    QuestionX.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            console.log(err);
            return res.redirect("/escrituraClassroom");
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
                return res.redirect("/escrituraClassroom");
            }
            return res.redirect("/escrituraClassroom/" + foundQuestion._id);
        });
    });
});



//Edit route
router.get("/:id/editX", middleware.isLoggedIn, middleware.checkQuestionXOwnership, function (req, res) {
    QuestionX.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            res.redirect("/escrituraClassroom");
        } else {
            res.render("editX", { questionX: foundQuestion });
        }
    })
});

//UPDATE ROUTE

router.put("/:id", middleware.isLoggedIn, middleware.checkQuestionXOwnership, function (req, res) {
    req.body.QuestionX.body = req.sanitize(req.body.QuestionX.body)
    QuestionX.findByIdAndUpdate(req.params.id, req.body.QuestionX, function (err, updatedQuestion) {
        if (err) {
            res.redirect("/escrituraClassroom");
        } else {
            res.redirect("/escrituraClassroom/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, middleware.checkQuestionXOwnership, function (req, res) {
    QuestionX.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/escrituraClassroom");
        } else {
            res.redirect("/escrituraClassroom");
        }
    })
});

//edit form 
/*router.get("/:id/edit", isLoggedIn, checkQuestionOwnership, function (req, res) {
    Question.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            res.redirect("/spanishClassroom");
        } else {
            res.render("spanishClassroom/edit", {question: foundQuestion});
        }
    });
});*/
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


            module.exports = router;
