const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    billing_id:{
        type:mongoose.ObjectId,
    },
    number:{
        type: String,
        required: false,
        default:'0'
    },
    
    user_id:{
        type: String,
        required: false,
        default:''
    },
   created_on:{
        type: String,
        required: false,
        default:''
   },
   


    
})

module.exports = mongoose.model('invoice',invoiceSchema,'invoice');