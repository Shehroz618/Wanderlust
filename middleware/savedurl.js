module.exports.editList = (req, res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be logged in first')
        
       return res.redirect('/user/login')
    }
    next();
}

module.exports.savedUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
       
    }
    next();
}