const jwt=require('jsonwebtoken')
require('dotenv').config()
const verifyToken=(req,res,next)=>{
    
        const author = req.headers['authorization']
        if(!author){
            return res.status(300).json({
                message:'Chưa có token'
            })
        }
        jwt.verify(author,process.env.token,(err,user)=>{
            if(err){
                if ((err.name = 'TokenExpiredError')) {
                    return res.status(401).json({
                        message: 'Token hết hạn',
                    });
                } else {
                    res.status(400).json({ error: 'Token không hợp lệ' });
                    return;
                }
            } else {
                req.user = user;
                next();
            }
        })
}
module.exports=verifyToken