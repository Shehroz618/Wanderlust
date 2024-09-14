const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const expressErr =  require('../utils/expressErr.js');
const User = require('../models/user.js')
const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
// const {redirectedUrl} = require('../middleware/savedurl.js')
const {savedUrl} = require('../middleware/savedurl.js');
const userControl = require('../controller/user.js')

 
//Rendering signup form
router.get('/signup', userControl.renderSignupForm)

router.post('/signupSuccess', userControl.signUpSuccess)

router.get('/login',userControl.renderLoginForm)



router.post('/loginSuccess', savedUrl, passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: "incorrect username or password" //automatically triggers error one
    

}), userControl.loginSuccess);

router.get('/logout',userControl.logout)  

module.exports = router;