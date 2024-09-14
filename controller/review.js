const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing')
const Review = require('../models/reviews');    
module.exports.addReview = wrapAsync(async(req,res)=>{
    let {id} = req.params;
    console.log(id);
    const singleList = await Listing.findById(id); 
    
    const newReview = new Review({
        ...req.body.review,
        author: req.user._id
    })

    singleList.reviews.push(newReview);
 
    await newReview.save();
    await singleList.save();
    req.flash("success","review added succeefully!")
    res.redirect(`/listing/${id}/listinfo`)
    
})


module.exports.destroyReview = wrapAsync( async (req,res)=>{
    let {id,reviewId} = req.params;
   const listData =  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}},{new:true});
   console.log(listData); 
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","review deleted")

    res.redirect(`/listing/${id}/listinfo`)

})