const modelSpending=require('../models/spendings')

const CreateSpending=async(req,res)=>{
    try {
        const {addSpending,amount,desc,status} =req.body
        if(!addSpending||!amount||!desc||!status){
            return res.status(300).json({
                message:'Bạn vui lòng điền đầy đủ thông tin'
            })
        }
        const newSpending= await modelSpending.insertMany({
            addSpending,amount,desc,status
        })
        return res.status(200).json({
            message:'successfully',
            data:newSpending
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const UpdateSpending=async(req,res)=>{
    try {
        const {_id}=req.params
        const {addSpending,amount,desc,status} =req.body
        if(!_id||!addSpending||!amount||!status){
            return res.status(300).json({
                message:'Bạn vui lòng điền đầy đủ thông tin hoặc chưa có id'
            })
        }
        const update= await modelSpending.findByIdAndUpdate(_id,{
            addSpending,amount,desc,status
        },{new:true})
        return res.status(200).json({
            message:'success',
            data:update
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const DeleteSpending= async(req,res)=>{
    try {
        const {_id} = req.params
        if(!_id){
            return res.status(300).json({
                message: "Chưa có id"
            })
        }
        await modelSpending.findByIdAndDelete(_id)
        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const GetSpending=async(req,res)=>{
    try {
        const status =req.query.status
        const limit = req.query.limit || 25
        const skip = req.query.skip || 1
        const lengthSpending= await modelSpending.find(
           {...( status !== undefined && {status:status})}
        )
        const totalPage= Math.ceil(lengthSpending.length / limit)
        const dataSpending= await modelSpending.find(
           {...( status !== undefined && {status:status})}
        )
        .sort({ createdAt: -1 })
        .skip((skip-1)*limit)
        .limit(limit)
        return res.status(200).json({
            data:dataSpending,
            totalPage:totalPage
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
module.exports={CreateSpending,UpdateSpending,DeleteSpending,GetSpending}