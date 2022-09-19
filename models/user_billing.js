const mongoose = require('mongoose');
const userBillSchema = new mongoose.Schema({
    billing_id:{
        type:mongoose.ObjectId,
    },
    user_id:{
        type: String,
        required: false,
        default:''
    },
   
    stateName:{
        type: String,
        required: false,
        default:''
    },
    
    cityName:{
        type: String,
        required: false,
        default:''
    },
    address:{
        type: String,
        required: false,
        default:''
    },
    gst:{
        type: String,
        required: false,
        default:'no'
    },
    gstNo:{
        type: String,
        required: false,
        default:''
    }


    
})

module.exports = mongoose.model('user_bill',userBillSchema,'user_bill');