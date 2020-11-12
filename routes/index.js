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



/*


router.get("/index", (req, res) => {
    const path = resolve(process.env.STATIC_DIR + "/index.ejs");
    res.sendFile(path);
});

// Fetch the Checkout Session to display the JSON result on the success page
router.get("/checkout-session", async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
});

router.post("/create-checkout-session", async (req, res) => {
    const domainURL = process.env.DOMAIN;
    const { priceId } = req.body;

    // Create new Checkout Session for the order
    // Other optional params include:
    // [billing_address_collection] - to display billing address details on the page
    // [customer] - if you have an existing Stripe Customer ID
    // [customer_email] - lets you prefill the email input in the form
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainURL}/canceled.html`,
    });

    res.send({
        sessionId: session.id,
    });
});

router.get("/setup", (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        basicPrice: process.env.BASIC_PRICE_ID,

    });
});

// Webhook handler for asynchronous events.
router.post("/webhook", async (req, res) => {
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];

        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
        console.log(`🔔  Payment received!`);
    }

    res.sendStatus(200);
});

*/



/*const product = await stripe.products.create({
    name: 'Standard month',
    type: 'service',
});

const price = await stripe.prices.create({

    id: 'plan_HI3d1ChvdB0dZh'',
    nickname: 'Standard month',
    product: 'plan_HI3d1ChvdB0dZh',
    unit_amount: 1299,
    currency: 'usd',
    recurring: {
        interval: 'month',
        usage_type: 'LICENSED',
    },
});
const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
        price: "{PRICE_ID}",
        quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/cancel',
});
*/

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
/*
router.get('/users/:id', async function (req, res) {
    try {
        let user = await User.findById(req.params.id).populate('followers').exec();
        res.render('profile', { user });
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('back');
    }
});
router.get('/follow/:id', isLoggedIn, async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        user.followers.push(req.user._id);
        user.save();
        req.flash('success', 'Successfully followed' + user.username + '!');
        res.redirect('/users/' + req.params.id);
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});
router.get('/notifications', isLoggedIn, async function (req, res) {
    try {
        let user = await User.findById(req.user._id).populate({
            path: 'notifications',
            options: { sort: { "_id": -1 } }
        }).exec();
        let allNotifications = user.notifications;
        res.render('notifications/index', { allNotifications });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});

router.get('/notifications/:id', isLoggedIn async function (req, res) {
    try {
        let notification = await Notification.findById(req.params.id);
        notification.isRead = true;
        notification.save();
        res.redirect('/spanishClassroom/${notification.questionId}');
    } catch(err) {
        re.flash('error', err.message);
        res.redirect('back');
    }
});
*/
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
    if (req.body.adminCode === 'adminPackage5BOfficial') {
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
/*
//view all notifications
router.get('/notifications', middleware.isLoggedIn, async function (req, res) {
    try {
        let user = await User.findById(req.user._id).populate({
            path: 'notifications',
            options: { sort: { "_id": -1 } }
        }).exec();
        let allNotifications = user.notifications;
        res.render('notifications/index', { allNotifications });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});
router.get('/notifications/:id', middleware.isLoggedIn, async function (req, res) {
    try {
        let notification = await Notification.findById(req.params.id);
        notification.isRead = true;
        notification.save();
        res.redirect('/spanishClassroom/${notification.questionId}');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
});*/

router.get("/checkout", async (req, res) => {
    const intent =
        res.render("checkout", { client_secret: intent.client_secret });
});


module.exports = router;
