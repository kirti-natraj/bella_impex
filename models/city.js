const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    city_id:{
        type:mongoose.ObjectId,
    },
    state_id:{
        type: String,
        required: false,

    },
    city_name:{
        type: String,
        required: false,   
    }
    
})

module.exports = mongoose.model('city',citySchema,'city');
