const modelUsers= require('../models/users')

const CheckPhoneAndEmail= async(data)=>{
    try {
        const checkPhone= await modelUsers.findOne({phone:data?.phone})
        const checkEmail= await modelUsers.findOne({email:data?.email})
        if(checkPhone){
            return false
        }
        if(checkEmail){
            return  false
        }
        return true
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
module.exports=CheckPhoneAndEmail