
    const mongoose = require('mongoose');
    const initData = require('./data.js');
    const Listing = require('../models/listing.js')


    //calling main function to check the ddb connect or not
    main().then(res=>console.log(res))
    .catch(err=>console.log(err))

    //connecting with db
    async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
    }

    const initDb = async ()=>{
        initData.data= initData.data.map((list)=>{ return {...list, owner:'66c9ca7086172f98ba710903'}})
        await Listing.insertMany(initData.data);
        console.log('saved succcess!')
        }
    initDb();

