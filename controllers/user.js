const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res) => {
    try{
         let {username, email, password} = req.body;

    const newUser = new User({email, username});
    const registeredUser= await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser , (err)=>{
        if(err){
            return next(err);
        }
          req.flash("success", "welcome to wanderlust");

            let redirectUrl = req.session.redirectUrl || "/listings";

            delete req.session.redirectUrl;

            res.redirect(redirectUrl);
        });
    
    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
     req.flash("success", "welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";  //agar redirectUrl hai to uspe redirect kar denge warna /listings pe
    delete req.session.redirectUrl;   //redirectUrl ko session se delete kar denge taki wo next time use na ho jaye
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "goodbye");
        res.redirect("/listings");
    });
};


