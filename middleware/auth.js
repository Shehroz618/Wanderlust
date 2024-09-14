const Review =require('../models/reviews.js');

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.isAuthenticated()); 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','you must be logged in first')
        
        return res.redirect('/user/login')
        // return res.redirect('/user/login')
    }
    next();
}

module.exports.savedUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.Isowner = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error",'you are not allowed')
       return res.redirect(`/listing/${id}/listinfo`)
    }
   
next();
}
