
var express = require("express");
var router = express.Router({ mergeParams: true });
var Question = require("../models/question");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Question.findById(req.params.id, function (err, question) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { question: question });
        }
    })
});
//comments create
router.post("/", middleware.isLoggedIn, function (req, res) {

    Question.findById(req.params.id, function (err, question) {
        if (err) {
            console.log(err);
            res.redirect("/spanishClassroom");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    if (req.user.isAdmin) {
                        comment.author.isAdmin = true;
                    }
                    //save comment
                    comment.save();
                    question.comment.push(comment);
                    question.save();
                    res.redirect('/spanishClassroom/' + question._id);
                }
            });
        }
    });
})

//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, middleware.isLoggedIn, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { question_id: req.params.id, comment: foundComment });
        }
    });
});
//Comment UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, middleware.isLoggedIn, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/spanishClassroom/" + req.params.id);
        }
    });
});
//Comment DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, middleware.isLoggedIn, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/spanishClassroom/" + req.params.id);
        }
    });
});


router.post("/:comment_id/like", middleware.isLoggedIn, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundComment.likes.some(function (like) {
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
                return res.redirect("/comments");
            } 
            res.render("/comments/", { comment: foundComment._id });
        });
    });
});



module.exports = router;
