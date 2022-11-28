const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    page_id:{
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
    pageName:{
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
    aboutPage:{
        type: String,
        required: false,
        default: ''
    },
    pageEmail:{
        type: String,
        required: false,
        default: ''
    },
    pageWebsite:{
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
pageSchema.index({ title: 'text', description: 'text', tags: 'text' })
module.exports = mongoose.model('page',pageSchema,'page');
