
var express = require("express");
var router = express.Router({ mergeParams: true });
var QuestionM = require("../models/questionM");
var CommentM = require("../models/commentM");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    QuestionM.findById(req.params.id, function (err, questionM) {
        if (err) {
            console.log(err);
        } else {
            res.render("commentsM/new", { questionM: questionM });
        }
    })
});
//comments create
router.post("/", middleware.isLoggedIn, function (req, res) {

    QuestionM.findById(req.params.id, function (err, questionM) {
        if (err) {
            console.log(err);
            res.redirect("/mathClassroom");
        } else {
            CommentM.create(req.body.commentM, function (err, commentM) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    commentM.author.id = req.user._id;
                    commentM.author.username = req.user.username;
                    if (req.user.isAdmin) {
                        commentM.author.isAdmin = true;
                    }
                    //save comment
                    commentM.save();
                    questionM.commentM.push(commentM);
                    questionM.save();
                    res.redirect('/mathClassroom/' + questionM._id);
                }
            });
        }
    });
})

//Comment edit route
router.get("/:commentM_id/edit", middleware.checkCommentMOwnership, middleware.isLoggedIn, function (req, res) {
    CommentM.findById(req.params.commentM_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("commentsM/edit", { questionM_id: req.params.id, commentM: foundComment });
        }
    });
});
//Comment UPDATE route
router.put("/:commentM_id", middleware.checkCommentMOwnership, middleware.isLoggedIn, function (req, res) {
    CommentM.findByIdAndUpdate(req.params.commentM_id, req.body.commentM, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/mathClassroom/" + req.params.id);
        }
    });
});
//Comment DESTROY
router.delete("/:commentM_id", middleware.checkCommentMOwnership, middleware.isLoggedIn, function (req, res) {
    CommentM.findByIdAndRemove(req.params.commentM_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/mathClassroom/" + req.params.id);
        }
    });
});


router.post("/:commentM_id/like", middleware.isLoggedIn, function (req, res) {
    CommentM.findById(req.params.commentM_id, function (err, foundComment) {
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
                return res.redirect("/commentsM");
            } 
            res.render("/commentsM/", { commentM: foundComment._id });
        });
    });
});



module.exports = router;
