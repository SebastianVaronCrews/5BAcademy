require('dotenv').config({ path: './.env' });
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


var QuestionM = require("../models/questionM");
var QuestionX = require("../models/questionX");
var QuestionE = require("../models/questionE");
var Question = require("../models/question");


var middleware = require("../middleware");



const stripe = require('stripe')('sk_test_R6n0RPwBEKV4gW2nyOrrAB1q00SMH2Ivnz');



router.get("/create-customer", function (req, res) {
    res.render("create-customer");
});

router.post('/create-customer', async (req, res) => {
    // Create a new customer object
    const customer = await stripe.customers.create({
        email: req.body.email,
    });

    // Recommendation: save the customer.id in your database.

    res.send({ customer });
});





//root route
router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/Info", function (req, res) {
    res.render("Info");
});

router.get("/salones", middleware.isLoggedIn, function (req, res) {
    res.render("salones");
});

router.get("/notebook", middleware.isLoggedIn, function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var perPage = 5;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        QuestionM.find({ body: regex }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allQuestions) {
            QuestionM.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("notebook", {
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
                    res.render("notebook", {
                        questionsM: allQuestions,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage)
                    });
                }
            });
        });
    }
});


//show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email });
    if (req.body.adminCode === 'adminPackage5Bdemo') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "A user with that username is already registered");
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/create-customer");
        });
    });
});



//show login form
router.get("/login", function (req, res) {
    res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/salones",
        failureRedirect: "/login",
    }), function (req, res) {

    });

//logout
router.get("/logout", middleware.isLoggedIn, function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged you out!");
    res.redirect("/");
});



module.exports = router;
