const mongoose =require('mongoose')
const schema=mongoose.Schema

const modelComment= new schema({
    name:{type:String},
    email:{type:String},
    wish:{type:String},
},
{ timestamps: true }
)

module.exports=mongoose.model('comments',modelComment)