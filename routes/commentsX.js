
var express = require("express");
var router = express.Router({ mergeParams: true });
var QuestionX = require("../models/questionX");
var CommentX = require("../models/commentX");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    QuestionX.findById(req.params.id, function (err, questionX) {
        if (err) {
            console.log(err);
        } else {
            res.render("commentsX/new", { questionX: questionX });
        }
    })
});
//comments create
router.post("/", middleware.isLoggedIn, function (req, res) {

    QuestionX.findById(req.params.id, function (err, questionX) {
        if (err) {
            console.log(err);
            res.redirect("/escrituraClassroom");
        } else {
            CommentX.create(req.body.commentX, function (err, commentX) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    commentX.author.id = req.user._id;
                    commentX.author.username = req.user.username;
                    if (req.user.isAdmin) {
                        commentX.author.isAdmin = true;
                    }
                    //save comment
                    commentX.save();
                    questionX.commentX.push(commentX);
                    questionX.save();
                    res.redirect('/escrituraClassroom/' + questionX._id);
                }
            });
        }
    });
})

//Comment edit route
router.get("/:commentX_id/edit", middleware.checkCommentXOwnership, middleware.isLoggedIn, function (req, res) {
    CommentX.findById(req.params.commentX_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("commentsX/edit", { questionX_id: req.params.id, commentX: foundComment });
        }
    });
});
//Comment UPDATE route
router.put("/:commentX_id", middleware.checkCommentXOwnership, middleware.isLoggedIn, function (req, res) {
    CommentX.findByIdAndUpdate(req.params.commentX_id, req.body.commentX, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/escrituraClassroom/" + req.params.id);
        }
    });
});
//Comment DESTROY
router.delete("/:commentX_id", middleware.checkCommentXOwnership, middleware.isLoggedIn, function (req, res) {
    CommentX.findByIdAndRemove(req.params.commentX_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/escrituraClassroom/" + req.params.id);
        }
    });
});


router.post("/:commentX_id/like", middleware.isLoggedIn, function (req, res) {
    CommentX.findById(req.params.commentX_id, function (err, foundComment) {
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
                return res.redirect("/commentsX");
            } 
            res.render("/commentsX/", { commentX: foundComment._id });
        });
    });
});



module.exports = router;
