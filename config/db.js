const mongoose=require('mongoose')
require('dotenv').config()

const ConnectData=async()=>{
    try {
        
        await mongoose.connect(process.env.URL)
            console.log('Connect successfully')
    } catch (error) {
        console.log(error)
        console.log('Can not connect')
    }
}
module.exports=ConnectData