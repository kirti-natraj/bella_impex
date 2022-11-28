const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    budget_id:{
        type:mongoose.ObjectId,
    },
    category_id:{
        type: String,
        required: false,

    },
    budget:{
        type: String,
        required: false,

    },
    from:{
        type: Number,
        required: false,
        default: 0
    },
    to:{
        type: Number,
        required: false,
        default: 0
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
