const modelUsers=require('../models/users')
const validate =require('../helps/validate')
const nodemailer = require('nodemailer');
require('dotenv').config()
const CreateUsers=async(req,res)=>{
    try {
        const {name,phone,email,guestOf,desc} =req.body
        if(!name||!phone||!email||!guestOf,!desc){
            return res.status(300).json({
                message:'Bạn vui lòng điền đầy đủ thông tin'
            })
        }
        const confirmEmail=await validate({email:email,phone:phone})
        if(!confirmEmail){
            return res.status(300).json({
                message:'Bạn vui lòng điền đúng định dạng email hoặc số điện thoại'
            })
        }
        const checkEmail= await modelUsers.findOne({phone:phone})
        if(checkEmail){
            return res.status(300).json({
                message:'Số điện thoại đã tồn tại'
            })
        }
        const newUser= await modelUsers.insertMany({
            name,
            phone,
            email,
            guestOf,
            desc
        })
        return res.status(200).json({
            message:'successfully',
            data:newUser
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const UpdateUsers= async(req,res)=>{
    try {
        const {_id,name,phone,email,guestOf,desc}= req.body
        if(!_id||!name||!email||!guestOf,!desc){
            return res.status(300).json({
                message:'Bạn vui lòng điền đầy đủ thông tin hoặc chưa có id'
            })
        }
        const confirmEmail=await validate({email:email,phone:phone})
        if(!confirmEmail){
            return res.status(300).json({
                message:'Bạn vui lòng điền đúng định dạng email hoặc số điện thoại'
            })
        }
        const update= await  modelUsers.findByIdAndUpdate(_id,{name,phone,email,guestOf,desc},{new:true})
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
const DeleteUser = async(req,res)=>{
    try {
        const {_id} = req.params
        if(!_id){
            return res.status(300).json({
                message: "Chưa có id"
            })
        }
        await modelUsers.findByIdAndDelete(_id)
        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const GetUsers= async(req,res)=>{
    try {
        const skipPage = parseInt(req.query.page) || 1;
        const limitPage = parseInt(req.query.limit) || 25;
        const search = req.query.search || '';
        const lengthUsers = await modelUsers.find({role:'Member'})
        const totalPage = Math.ceil(lengthUsers.length / limitPage);
        const dataUser= await modelUsers.aggregate([
           { $match:{
                role:'Member',
                 $or: [
                { phone: { $regex: search,$options: 'i' } },
                { name: { $regex: search,$options: 'i' } },],
            }},
            { $skip: (skipPage - 1) * limitPage },
            { $limit: limitPage },
    ])
        
        return res.status(200).json({
            data:dataUser,
            totalPage:totalPage
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const SendEmailClient=async(req,res)=>{
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_EMAIL,
        },
    });
    const mailOptions = {
        from: `${process.env.USER_EMAIL}`, // sender address
        to: `${email}`, // list of receivers
        subject: 'Set your new Atlassian password', // Subject line
        text: 'Password retrieval', // plaintext body
        html: `
               <div>hello
               </div>
        
        `, // html body
    };
    transporter.sendMail(mailOptions);
}
module.exports={CreateUsers,UpdateUsers,DeleteUser,GetUsers,SendEmailClient}