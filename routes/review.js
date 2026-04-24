const express = require('express');
const { model } = require('mongoose');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const { validateReview, isLoggedIn} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Reviews
// POST route
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//Delete route for reviews
//Delete Route
router.delete("/:reviewId",
    isLoggedIn,
    wrapAsync(reviewController.destroyReview)
);
module.exports = router;