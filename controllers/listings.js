const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("reviews")
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);  // Debugging log to check the listing object
    res.render("listings/show.ejs", { listing });
};

module.exports.createlisting = async (req, res) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // Set the owner to the currently logged-in user
        await newListing.save();
        res.redirect("/listings");
    };

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid ID");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.updatelisting = async (req, res) => {
        let {id} = req.params;
        let listing = await listing.findById(id);
        if (!listing.owner.equals(currUser._id)){
            req.flash("error", "You don't have permission to edit ");
            return res.redirect(`/listings/${id}`);
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid ID");
            return res.redirect(`/listings/${id}`);
        }

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    };

    module.exports.destroyListing = async (req, res) => {
        let { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid ID");
            return res.redirect("/listings");
        }
    
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    };
    



