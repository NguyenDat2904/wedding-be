const mongoose =require('mongoose')
const schema=mongoose.Schema

const modelAdmin= new schema({
    name:{type:String},
    userName:{type:String},
    passWord:{type:String},
},
{ timestamps: true }
)
module.exports=mongoose.model('admins',modelAdmin)