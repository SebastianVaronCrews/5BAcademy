
var express = require("express");
var router = express.Router();
var QuestionE = require("../models/questionE");
var middleware = require("../middleware");

//index route
router.get("/", middleware.isLoggedIn, function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var perPage = 5;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        QuestionE.find({body:regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            QuestionE.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("english/englishClassroom", {
                        questionsE: allQuestions,
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
        QuestionE.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            QuestionE.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("english/englishClassroom", {
                        questionsE: allQuestions,
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
    QuestionE.find({}, function (err, questionsE) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("english/ask", { questionsE: questionsE });
        }
    });
});
//create route
router.post("/", middleware.isLoggedIn, function (req, res) {
    /*    var title = req.body.title;
        var question = req.body.question;
        var image = req.body.image
      
        var newQuestion = { title: title, question: question, image: image };*/
    req.body.QuestionE.body = req.sanitize(req.body.QuestionE.body)

    QuestionE.create(req.body.QuestionE, function (err, questionE) {
        if (err) {
            console.log(err);
        } else {
            questionE.author.id = req.user._id;
            questionE.author.username = req.user.username;
            //save comment
            questionE.save();
            res.redirect("/englishClassroom");
        }
    });
});

router.get("/notebook", middleware.isLoggedIn, function (req, res) {
    QuestionE.find({}, function (err, questionsE) {
        if (err) {
            console.log("err");
        } else {
            res.render("english/notebook", { questionsE: questionsE });
        }
    });
});

//show route
router.get("/:id", middleware.isLoggedIn, function (req, res) {
    QuestionE.findById(req.params.id).populate({ path:"likes", path: "commentE", populate: { path: "likes" } }).exec(function (err, foundQuestion) {
        if (err) {
            res.redirect("/englishClassroom");
        } else {
            res.render("english/show", { questionE: foundQuestion });
        }
    })
});

// Question Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    QuestionE.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            console.log(err);
            return res.redirect("/englishClassroom");
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
                return res.redirect("/englishClassroom");
            }
            return res.redirect("/englishClassroom/" + foundQuestion._id);
        });
    });
});



//Edit route
router.get("/:id/editE", middleware.isLoggedIn, middleware.checkQuestionEOwnership, function (req, res) {
    QuestionE.findById(req.params.id, function (err, foundQuestion) {
        if (err) {
            res.redirect("/englishClassroom");
        } else {
            res.render("editE", { questionE: foundQuestion });
        }
    })
});

//UPDATE ROUTE

router.put("/:id", middleware.isLoggedIn, middleware.checkQuestionEOwnership, function (req, res) {
    req.body.QuestionE.body = req.sanitize(req.body.QuestionE.body)
    QuestionE.findByIdAndUpdate(req.params.id, req.body.QuestionE, function (err, updatedQuestion) {
        if (err) {
            res.redirect("/englishClassroom");
        } else {
            res.redirect("/englishClassroom/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, middleware.checkQuestionEOwnership, function (req, res) {
    QuestionE.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/englishClassroom");
        } else {
            res.redirect("/englishClassroom");
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
