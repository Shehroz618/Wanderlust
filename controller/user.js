const User = require('../models/user');


module.exports.renderSignupForm = (req,res)=>{
    res.render('includes/signupform.ejs')
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("includes/loginform.ejs")
}

module.exports.signUpSuccess = async (req,res,next)=>{
try{
      let {username,email,password} = req.body;
      const existUser = await User.findOne({$or:[{username},{email}]})
  
                if(existUser){
                    req.flash('error', 'Username or email already exists. Please choose a different one.');
                    return res.redirect('/user/signup');
                }
            
                const singleUser = new User({
                    username: username,
                    email: email
                })
  
     const myUser = await User.register(singleUser,password);
  
     req.login(myUser,(err)=>{
         if(err){
          return next(err);
         }
         req.flash('success',"Congratz you successfully signed-up");
         res.redirect('/listing')
     })
    
}catch(err){
      next(err);}
}

module.exports.loginSuccess =  async(req,res)=>{
    
    req.flash('success','welcome back you have logged in');
    res.redirect(res.locals.redirectUrl || '/listing');
    
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
     if(err){
         return next(err)
     }
     req.flash("success", "successfully logout")
     res.redirect('/user/login')
    }) 
   
}