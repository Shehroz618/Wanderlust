const Listing = require('../models/listing.js')
const wrapAsync = require('../utils/wrapAsync.js')
const mbxgeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
 let mapToken = process.env.MAP_ACCESS_TOKEN
const geoCodingClient = mbxgeoCoding({ accessToken: mapToken});


module.exports.showAllList = async (req,res)=>{
    let listing = await Listing.find({})
    res.render('listings/listingdata.ejs',{listing});   

}

module.exports.addListForm =  (req,res)=>{
    
    res.render('listings/addlistform.ejs')
}

module.exports.showSingleList = async (req,res)=>{
    let {id} = req.params;
    const singleList = await Listing.findById(id)
    .populate({path: 'reviews',populate:{path:'author'}})  //means popultae all reviews for a list and then for a single list ke liye author bhi a jae
    .populate('owner')
    // console.log(singleList) 
    // console.log(req.user);
     res.render("listings/singlelistinfo.ejs",{singleList})
}

module.exports.showFilterLists = async (req, res) => {
    const { theme } = req.query;  // Get the filter criteria from the query parameters
    
  
    try {
      // If no theme is provided, you might want to show all listings or handle it differently
      const filterCriteria = theme ? { theme: theme } : {};
      console.log(filterCriteria)
  
      // Find listings based on the filter criteria
      const filteredListings = await Listing.find(filterCriteria)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');
    
      // Render the view to show filtered listings
      // res.render('listings/filteredListings.ejs', { listings: filteredListings });
      console.log(filteredListings)
      res.render("listings/singlelistinfoFilter.ejs",{singleList:filteredListings})
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  
}
    module.exports.showFilterListsByBtns = wrapAsync(async(req,res,next)=>{
        const {query,country,themeForm} = req.body;
        console.log(themeForm)
        let filterObject = {};
        
        if(themeForm) filterObject.theme = themeForm;
        if(query) filterObject.title = {$regex:query, $options:'i'};
        if(country) filterObject.country = country;
      
        
          const filtereList = await Listing.find(filterObject)
          .populate({path:'reviews', populate:{path:'author'}})
          .populate('owner');
          
          res.render("listings/singlelistinfoFilter.ejs", { singleList: filtereList });
    })

 module.exports.addListSuccess =  wrapAsync (async (req,res,next)=>{
   
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.List.location,
        limit: 1
      }).send();
        
        // console.log(response.body.features[0].geometry)
       
    
    const newList = new Listing({
     ...req.body.List,
        owner: req.user._id, // Assuming req.user contains the logged-in user's data
        image:{
            url: req.file.path,
            filename: req.file.filename
        }

    });

  
       
    newList.geometry = response.body.features[0].geometry;
    await newList.save();
   req.flash("success","LIST ADDED SUCCESSFULLY");
//    console.log(res.locals.successMsg);
   res.redirect('/listing');
   

})

// module.exports.addListSuccess = (req,res)=>{
//     res.send(req.file);
// }




module.exports.editForm = async (req,res)=>{
    let {id} = req.params;
    let singleList = await Listing.findById(id);
    if(!singleList){
        req.flash("deleted","your list was being delted")
        res.redirect(`/listing`)
    }
   originalImageUrl = singleList.image.url;
   originalImageUrl.replace('/upload', '/upload/h_200,w_250')
    res.render('listings/eidtform.ejs',{singleList, originalImageUrl})
}

module.exports.editSuccess = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    if(!req.body.singleList){
        throw new expressErr(400,"Send valid data for listing")
    }
    const myList = req.body.singleList; 
  
     await Listing.findByIdAndUpdate({_id: id},myList,{new: true});
    req.flash("success","List Updated Successfully")
     res.redirect('/listing')
   
})

module.exports.destroyList = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("deleted","your list has deleted!")
    res.redirect('/listing')
}