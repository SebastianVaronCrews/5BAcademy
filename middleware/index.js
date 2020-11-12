var Question = require("../models/question");
var Comment = require("../models/comment");
var QuestionX = require("../models/questionX");
var CommentX = require("../models/commentX");
var QuestionE = require("../models/questionE");
var CommentE = require("../models/commentE");
var QuestionM = require("../models/questionM");
var CommentM = require("../models/commentM");
var middlewareObj = {};

middlewareObj.checkQuestionOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Question.findById(req.params.id, function (err, foundQuestion) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundQuestion.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");

    }
}
// Math
middlewareObj.checkQuestionMOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        QuestionM.findById(req.params.id, function (err, foundQuestion) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundQuestion.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentMOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        CommentM.findById(req.params.commentM_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");

    }
}
//English
middlewareObj.checkQuestionEOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        QuestionE.findById(req.params.id, function (err, foundQuestion) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundQuestion.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentEOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        CommentE.findById(req.params.commentE_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");

    }
}

//Escritura
middlewareObj.checkQuestionXOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        QuestionX.findById(req.params.id, function (err, foundQuestion) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundQuestion.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentXOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        CommentX.findById(req.params.commentX_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");

    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}


module.exports = middlewareObj
