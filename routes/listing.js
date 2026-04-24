const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const mongoose = require("mongoose");

const listingController = require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.index)) // GET route for all listings
    .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createlisting));  // POST route for creating a new listing
    
// ================= NEW =================
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
      isOwner,
    validateListing,
    wrapAsync(listingController.updatelisting))

    .delete(
    isLoggedIn,
      isOwner,
    wrapAsync(listingController.destroyListing)
    );


// ================= EDIT =================
// ✅ IMPORTANT: before /:id
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.renderEditForm));




module.exports = router;