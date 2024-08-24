const mongoose =require('mongoose')
const schema=mongoose.Schema

const modelUsers= new schema({
    name:{type:String},
    phone:{type:String},
    email:{type:String},
    guestOf:{type:String},
    isConfirm:{type:Boolean},
    numberOfPeople:{type:Number},
    desc:{type:String},
    userName:{type:String},
    passWord:{type:String},
    role:{type: String, default: 'Member' }
},
{ timestamps: true }
)

module.exports=mongoose.model('users',modelUsers)