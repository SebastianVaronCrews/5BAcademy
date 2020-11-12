
var express = require("express");
var router = express.Router({ mergeParams: true });
var QuestionE = require("../models/questionE");
var CommentE = require("../models/commentE");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    QuestionE.findById(req.params.id, function (err, questionE) {
        if (err) {
            console.log(err);
        } else {
            res.render("commentsE/new", { questionE: questionE });
        }
    })
});
//comments create
router.post("/", middleware.isLoggedIn, function (req, res) {

    QuestionE.findById(req.params.id, function (err, questionE) {
        if (err) {
            console.log(err);
            res.redirect("/englishClassroom");
        } else {
            CommentE.create(req.body.commentE, function (err, commentE) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    commentE.author.id = req.user._id;
                    commentE.author.username = req.user.username;
                    if (req.user.isAdmin) {
                        commentE.author.isAdmin = true;
                    }
                    //save comment
                    commentE.save();
                    questionE.commentE.push(commentE);
                    questionE.save();
                    res.redirect('/englishClassroom/' + questionE._id);
                }
            });
        }
    });
})

//Comment edit route
router.get("/:commentE_id/edit", middleware.checkCommentEOwnership, middleware.isLoggedIn, function (req, res) {
    CommentE.findById(req.params.commentE_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("commentsE/edit", { questionE_id: req.params.id, commentE: foundComment });
        }
    });
});
//Comment UPDATE route
router.put("/:commentE_id", middleware.checkCommentEOwnership, middleware.isLoggedIn, function (req, res) {
    CommentE.findByIdAndUpdate(req.params.commentE_id, req.body.commentE, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/englishClassroom/" + req.params.id);
        }
    });
});
//Comment DESTROY
router.delete("/:commentE_id", middleware.checkCommentEOwnership, middleware.isLoggedIn, function (req, res) {
    CommentE.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/englishClassroom/" + req.params.id);
        }
    });
});


router.post("/:commentE_id/like", middleware.isLoggedIn, function (req, res) {
    CommentE.findById(req.params.commentE_id, function (err, foundComment) {
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
                return res.redirect("/commentsE");
            } 
            res.render("/commentsE/", { commentE: foundComment._id });
        });
    });
});



module.exports = router;
