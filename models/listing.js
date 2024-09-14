const mongoose = require('mongoose')
// const Review  = require('./models/reviews.js')
const Review = require('./reviews.js');
const User = require('./user.js');
const { required } = require('joi');
const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title:{
//         type: String,
//         required: true
//     },
//     description:{
//         type: String
        
//     },
//     image:{
//         type: String,
//         // default: "https://images.unsplash.com/photo-1720858187324-8bfd71b7929a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//     },
//     price:{
//         type: Number
//     },
//     location:{
//         type: String
//     },
//     country:{
//         type: String
//     }

// })

const listingSchema = new Schema({
    title: {
        type: String,
       
    },
    description: {
        type: String,
       
    },
    image: {
        filename: {
            type: String,
            // required: true
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        }

        // url: String,
        // filename: String,
    },
    price: {
        type: Number,
        // required: true
    },
    location: {
        type: String,
        
    },
    country: {
        type: String,
        
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'], // Ensure this matches the GeoJSON type
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers [longitude, latitude]
            required: true
        }
    },

    theme:{
        type:String,
        required: true
    }



});

listingSchema.post("findOneAndDelete",async (listData)=>{
   if(listData){
    await Review.deleteMany({_id: {$in:listData.reviews}})
   }
})

const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing;