const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
     if(!req.isAuthenticated()){ //user is not logged in
        req.session.redirectUrl = req.originalUrl;   //to hum login hone ke baad us page pe redirect kar denge jaha se wo login karne gya tha
        req.flash("error", "You must be signed in to create a listing"); 
        return res.redirect("/login");  
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){  
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
    };

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
        let lising = await Listing.findById(id);
        if(!lising.owner.equals(req.user._id)) { // Check if the logged-in user is the owner of the listing
            req.flash("error", "You are not owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    };

module.exports.validateListing = (req, res, next) => {
        let { error } = listingSchema.validate(req.body);
        if (error) {
            let errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
    };

module.exports.validateReview = (req, res, next) => {
        let { error} = reviewSchema.validate(req.body);
        if (error) {
            let errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        }
    };
