const express = require("express");
const router = express.Router({mergeParams: true}); // merger use to get the access of id in the reviewRoute or to get the merge parent with child
const Listing = require('../models/listing')
const Review = require('../models/reviews')
const wrapAsync = require('../utils/wrapAsync');
const expressErr =  require('../utils/expressErr');
const {reviewSchema} = require('../schema.js');
const { isLoggedIn, savedUrl, Isowner } = require("../middleware/auth.js");
const reviewControl = require('../controller/review.js');


const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const msg =  error.details.map(detail=>detail.message).join(',');
        throw new expressErr(msg, 404);
    }
    else{
        next();
    }
}

//FOR ADDING THE REVIEW
router.post('/', isLoggedIn, validateReview, reviewControl.addReview)

// FOR REVIEW DELETE
router.delete('/:reviewId', isLoggedIn, Isowner, reviewControl.destroyReview)




module.exports = router;