const mongoose = require("mongoose")
const schema=mongoose.Schema

const modelSpending=new schema({
    addSpending:{type:String},
    amount:{type:Number},
    desc:{type:String},
    status:{type:String,enum:['paid','unpaid']},
    money:{type:Number}
},{ timestamps: true })

module.exports=mongoose.model('spendings',modelSpending)