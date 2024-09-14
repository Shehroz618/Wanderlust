if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');

const expressErr =  require('./utils/expressErr');

const Listing = require('./models/listing.js')


const listingRouter = require("./routes/listingRoute.js"); 
const reviewRoute = require('./routes/reviewRoute.js');
const signupRoute = require('./routes/userRoute.js');

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const User = require('./models/user.js')


// view engine 
app.set('view engine','ejs');
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname,'views'));

//for getting access static file and body parsing
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));

// const localDB = "mongodb://127.0.0.1:27017/wanderlust";
const mongoDB = process.env.ATLASDB_URL;

//connecting with db
async function main(){
  await mongoose.connect(mongoDB);
}
//calling main function to check the ddb connect or not
main().then(res=>console.log(res))
.catch(err=>console.log(err))

const store = MongoStore.create({
  mongoUrl: mongoDB,
  crypto: {
    secret: process.env.SESSION_SECRET || 'defaultsecret', // Secret for encrypting session data
  },
  touchAfter: 24 * 3600,    //if user came-up on the site so there's session created now he's not doing any action like just refreshing the page so session info will not update untill 24hrs

})

const sesstionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,              //if nothing cahnges so session will not update
  saveUninitialized: true,      //if not any action taken even will session be created
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    
  },
}

app.use(session(sesstionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash('error')
    res.locals.deleteMsg = req.flash("deleted");
    res.locals.currUser = req.user;

    next()
})

app.use('/listing',listingRouter);
app.use('/listing/:id/reviews',reviewRoute)
app.use('/user',signupRoute);



app.all("*", (req,res,next)=>{
    next(new expressErr("Page Not Found",404))   
    // next(new expressErr(404,"Page not found!"));   
});



app.use((err, req, res, next) => {
    let { statusCode = 400, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
    // res.status(statusCode).render('listings/err.ejs',{err})
});

// defining port and lisening function
const port = 8080;
app.listen(port, ()=>{
    console.log(`server is listening at ${port}`)
})

process.on('SIGINT', () => {
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });