const validate =require('../helps/validate')
const modelComment= require('../models/comment')
const CreateComment=async(req,res)=>{
    try {
        const {name,email,wish}=req.body
        if(!name||!wish){
            return res.status(300).json({
                message:'Bạn vui lòng điền đầy đủ thông tin'
            })
        }
        const newComment= await modelComment.insertMany({
            name,
            email,
            wish
        })
        const [singleComment] = [...newComment]
        return res.status(200).json({
            message:'successfully',
            data:singleComment
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const UpdateComments= async(req,res)=>{
    try {
        const {_id}= req.params
        const {name,email,wish}= req.body
        if(!name||!wish||!_id){
            return res.status(300).json({
                message:'Bạn vui lòng điền đầy đủ thông tin hoặc chưa có id'
            })
        }
        const update= await  modelComment.findByIdAndUpdate(_id,{name,email,wish},{new:true})
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
const DeleteComments = async(req,res)=>{
    try {
        const {_id} = req.params
        if(!_id){
            return res.status(300).json({
                message: "Chưa có id"
            })
        }
        await modelComment.findByIdAndDelete(_id)
        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const GetComments= async(req,res)=>{
    try {
        const skipPage = parseInt(req.query.skip) || 1;
        const limitPage = parseInt(req.query.limit) || 25;
        const search = req.query.search || '';
        const maxData=req.query.MaxData||""
        const lengthUsers = await modelComment.aggregate([
            { $match:{
                  $or: [
                 { name: { $regex: search,$options: 'i' } },],
             }}
     ])
        const totalPage = Math.ceil(lengthUsers.length / limitPage);
        const dataUser= await modelComment.aggregate([
           { $match:{
                 $or: [
                { name: { $regex: search,$options: 'i' } },],
            }},
            {$sort:{createdAt:-1}},
            { $skip: (skipPage - 1) * limitPage },
            { $limit: limitPage },
    ])

        return res.status(200).json({
            data:maxData==="MaxData"?lengthUsers:dataUser,
            totalPage:totalPage
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
module.exports={CreateComment,UpdateComments,DeleteComments,GetComments}
