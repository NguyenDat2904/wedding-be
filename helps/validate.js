const Joi=require('joi')
const validateSchema=(data)=>{
   const schema = Joi.object({
        email: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)).required(),
        phone: Joi.string().pattern(new RegExp(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/)).required()
      });
      const {error,value}= schema.validate(data)
      if (error) {
       return false
      }else{
        return true
      }
}
   

module.exports=validateSchema