const mongoose =require('mongoose')
const schema=mongoose.Schema

const modelUsers= new schema({
    name:{type:String},
    phone:{type:String},
    email:{type:String},
    family:{type:String,enum:['groom','bride']},
    isConfirm:{type:Boolean},
    numberOfPeople:{type:Number},
    desc:{type:String},
    luckyMoney:{type:String},
    isInvitation:{type:Boolean},
    relationship :{ type: String, enum: ['friend', 'colleague', 'relatives']},
    commonName:{type:String}
},
{ timestamps: true }
)

module.exports=mongoose.model('users',modelUsers)