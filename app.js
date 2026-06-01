if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");   

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// //  MongoDB Connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.MONGO_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:  process.env.SECRET,
    },
    touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", err);
});
const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
    },
};



// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//Session MUST be before flash & passport
app.use(session(sessionOptions));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());

// ✅ ADD THIS HERE
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Passport Config (FIXED)
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then(() => {
    console.log("Connected to DB");

    app.listen(8080, () => {
        console.log("server is listening to port 8080");
    });

})
.catch((err) => {
    console.log(err);
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
    res.send("hi, i am root");
});

//  Demo User Route (fixed password typo)
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

//  App Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//  Error Handling
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    console.log(err); // actual error terminal me print hoga

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});