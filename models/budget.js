const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    budget_id:{
        type:mongoose.ObjectId,
    },
   
    budget:{
        type: String,
        required: false,

    },
    created_on:{
        type: Date,
        required: false,
       default: Date.now()

    },
    created_by:{
        type: String,
        required: false,
        default: 'Admin'

    },
    status:{
        type: Boolean,
        required: false,
        default: true
    },
})

module.exports = mongoose.model('budget',budgetSchema,'budget');
