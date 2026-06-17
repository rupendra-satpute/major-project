const express = require('express');
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middlewares.js");
const mongoose = require("mongoose");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage }  = require('../cloudConfig.js');
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index)) // GET route for all listings
    .post(
    isLoggedIn,
   upload.single('listing[image]'),
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
     upload.single('listing[image]'),
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