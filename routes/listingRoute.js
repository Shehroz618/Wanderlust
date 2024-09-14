const express = require("express");
const router = express.Router(); 
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const expressErr =  require('../utils/expressErr');
const {listSchema} = require('../schema.js')
const {isLoggedIn,Isowner, savedUrl}  = require('../middleware/auth.js');
const {editList}  = require('../middleware/savedurl.js');
const listingControl = require('../controller/listing.js');
const multer = require('multer');
const {storage} = require('../cloudinaryconfig.js');
const upload = multer({storage})

const validateListing = (req,res,next)=>{
    let {error} = listSchema.validate(req.body);
    if(error){
        const msg =  error.details.map(detail=>detail.message).join(',');
        throw new expressErr(msg, 404);
    }
    else{
        next();
    }
}



//Showing all list
router.route('/')
.get(listingControl.showAllList)


// Rendering Adding list form
router.get('/addList',isLoggedIn, listingControl.addListForm)

// showing single list info
router.route('/:id/listinfo')
.get(listingControl.showSingleList)

router.route('/filter')
.get(listingControl.showFilterLists)

router.route('/filter/searchbtn')
.post(listingControl.showFilterListsByBtns)


// FOR ADDING THE LIST   validateListing
router.post('/addList/successAdded',isLoggedIn, savedUrl, 
 upload.single('List[image][url]'),  listingControl.addListSuccess);


// router.post('/addList/successAdded',upload.single('image'),async(req,res)=>{
//     res.send(req.file);
// })

//for giving the edit form
router.route('/:id/edit')
.get(isLoggedIn, listingControl.editForm)

// router.get('/:id/edit', isLoggedIn, listingControl.editForm)



// FOR SUCCESS EDIT
router.put('/:id/edit/updated',listingControl.editSuccess)



//FOR DELETING THE LIST
router.delete('/:id/deletedSuccess',listingControl.destroyList)

module.exports = router;