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
        const token = await asignToken({name:hashPassword.name,_id:hashPassword._id},"24h")
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
const createAdmin = async (req, res) => {
    try {
        const { name, userName, passWord } = req.body;
        
        // Mã hóa mật khẩu bằng bcrypt (bất đồng bộ)
        const salt = await bcrypt.genSalt(10);
        const hashPassWord = await bcrypt.hash(passWord, salt);

        // Tạo admin mới
        const newAdmin = await modelUSers.create({
            name,
            userName,
            passWord: hashPassWord
        });

        // Trả về phản hồi thành công
        return res.status(200).json({
            data: newAdmin
        });

    } catch (error) {
        // Trả về lỗi nếu có vấn đề xảy ra
        return res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
}

module.exports={LoginAdmin,createAdmin}
