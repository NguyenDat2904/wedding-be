const jwt = require('jsonwebtoken')
require("dotenv").config();
const AuthorToken=async(data,time)=>{
    const payload=data;
    const option={
        expiresIn:time
    }
    return jwt.sign(payload,process.env.token,option)
}
module.exports=AuthorToken