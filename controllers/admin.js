const modelUSers=require("../models/admins")
const bcrypt = require('bcrypt')
const asignToken=require('../helps/authorToken')
const LoginAdmin=async(req,res)=>{
    try {
        const {userName,passWord}=req.body;
        if(!userName || !passWord){
            return res.status(300).json({
                message:'Bạn vui lòng điền tài khoản và mật khẩu'
            })
        }
        const hashPassword= await modelUSers.findOne({userName:userName})
        const comparePassword= await bcrypt.compare(passWord,hashPassword.passWord)
        const token = await asignToken({name:hashPassword.name,_id:hashPassword._id},"1h")
        if(hashPassword===null)
            {
                return res.status(300).json({
                    message:'Tên đăng nhập chưa tồn tại'
                })
            }
            if(!comparePassword){
                return res.status(300).json({
                    message:'Tên đăng nhập không đúng'
                })
            }
            return res.status(200).json({
                data:{name:hashPassword.name,_id:hashPassword._id},
                token:token
            })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
const createAdmin=async(req,res)=>{
    try {
        const {name,userName,passWord}=req.body
        const salt = bcrypt.genSaltSync(10);
        const hashPassWord = bcrypt.hashSync(passWord, salt);
        const newAdmin=await modelUSers.insertMany({
            name,userName,passWord:hashPassWord
        })
        return res.status(200).json({
            data:newAdmin
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
module.exports={LoginAdmin,createAdmin}