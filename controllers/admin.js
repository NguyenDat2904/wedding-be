const modelUsers= require('../models/users')
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
        const hashPassword= await modelUsers.findOne({userName:userName})
        const comparePassword= await bcrypt.compare(passWord,hashPassword.passWord)
        const token = await asignToken({name:hashPassword.name,_id:hashPassword._id},"5h")
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
                data:hashPassword,
                token:token
            })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
module.exports=LoginAdmin