const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    inv_id:{
        type:mongoose.ObjectId,
    },
    user_id:{
        type: String,
        required: false,

    },
    invoice:{
        type: String,
        required: false,   
    }
    
})

module.exports = mongoose.model('invoicePdf',invoiceSchema,'invoicePdf');
