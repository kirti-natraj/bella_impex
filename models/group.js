const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    group_id:{
        type:mongoose.ObjectId,
    },
    userId:{
        type: String,
        required: false,
        default: ''
    },
    coverImage:{
        type: String,
        required: false,
        default: ''
    },
    profileImage:{
        type: String,
        required: false,
        default: ''
    },
    groupName:{
        type: String,
        required: false,
        default: ''
    },
    categoryId:{
        type: String,
        required: false,
        default: ''
    },
    categoryName:{
        type: String,
        required: false,
        default: ''

    },
    aboutGroup:{
        type: String,
        required: false,
        default: ''
    },
    privacyStandard:{
        type: String,
        required: false,
        default: ''
    },
    location:{
        type: String,
        required: false,
        default: ''
    },
    likePeople:{
        type: Array,
       
    },
    addPeople:{
        type: Array,
      
    },
    invite:{
        type: Array,
       
    },
    created_on:{
        type: String,
        required: false,
        default: 0
    }
   
},
{
    autoIndex: false
  }
)
groupSchema.index({ title: 'text', description: 'text', tags: 'text' })
module.exports = mongoose.model('group',groupSchema,'group');
