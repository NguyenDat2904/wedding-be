const modelUsers=require('../models/users')
const validate =require('../helps/validate')
const nodemailer = require('nodemailer');
const checkEmailAndPhone= require('../helps/checkEmailAnhPhone')
require('dotenv').config()
const CreateUsers=async(req,res)=>{
    try {
        const {name,phone,isConfirm,family, desc, relationship, commonName} =req.body
        if(!name||!family||!desc||!relationship||!commonName){
            return res.status(300).json({
                message:'Bạn vui lòng điền đầy đủ thông tin'
            })
        }
        const checkPhone= await checkEmailAndPhone({phone:phone})
        if(!checkPhone)
        {
            return res.status(300).json({
                message:' Số điện thoại đã tồn tại'
            })
        }
        const newUser= await modelUsers.insertMany({
            name,
            phone,
            email:'',
            family,
            isConfirm,
            numberOfPeople:null,
            desc,
            luckyMoney:null,
            isInvitation:false,
            relationship,
            commonName
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
        const {_id}=req.params
        const {name,phone,email,family,isConfirm,
            numberOfPeople, desc,luckyMoney,
            isInvitation, relationship, commonName}= req.body
        if(!_id||!name||!phone||!email||!family||
            
            !relationship|| !commonName){
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
        const detailUser=await modelUsers.findById(_id)
        const checkEmail= await checkEmailAndPhone({email:email})
        if(!checkEmail&&detailUser.email!==email){
            return res.status(300).json({
                message:'Email đã tồn tại'
            })
        }
        const checkPhone= await checkEmailAndPhone({phone:phone})
        if(!checkPhone&&detailUser.phone!==phone)
        {
            return res.status(300).json({
                message:' Số điện thoại đã tồn tại'
            })
        }
        const update= await  modelUsers.findByIdAndUpdate(_id,{
            name,phone,email,family,isConfirm,
            numberOfPeople, desc,luckyMoney,
            isInvitation, relationship, commonName
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
        const skipPage = parseInt(req.query.skip) || 1;
        const limitPage = parseInt(req.query.limit) || 25;
        const search = req.query.search || '';
        const lengthUsers = await modelUsers.aggregate([
            { $match:{
                  $or: [
                 { phone: { $regex: search,$options: 'i' } },
                 { name: { $regex: search,$options: 'i' } },],
             }}])
        const totalPage = Math.ceil(lengthUsers.length / limitPage);
        const dataUser= await modelUsers.aggregate([
           { $match:{
                 $or: [
                { phone: { $regex: search,$options: 'i' } },
                { name: { $regex: search,$options: 'i' } },],
            }},
            {$sort:{ createdAt: -1 }},
            { $skip: ((skipPage - 1) * limitPage) },
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
    const detailUser= await modelUsers.findOne({email:email})
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
        subject: 'Thư cảm ơn đã đên tham dự', // Subject line
        html: `
              <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wedding Confirmation Email</title>
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #747ba9;
            color: #fff;
            margin: 0;
            padding: 20px;
            background-image: url('https://www.transparenttextures.com/patterns/cubes.png');
            background-repeat: repeat; /* Sử dụng repeat để khối cube lặp lại */
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            color: #747ba9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .banner {
            position: relative;
            background: #e8dcd2; /* Màu nền mới cho banner */
            padding: 60px 20px; /* Tăng padding để có thêm không gian cho hình ảnh lớn hơn */
            text-align: center;
            color: #d46a92;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden; /* Giữ hình ảnh không bị tràn ra ngoài */
        }

        .banner h1 {
            font-family: 'Oooh Baby', cursive;
            font-size: 32px; /* Kích thước font của tên */
            margin: 0;
            color: #a05375;
            font-weight: 400; /* Giảm font-weight */
        }

        .banner h1 span {
            font-size: 24px; /* Kích thước font nhỏ hơn cho ký tự & */
        }

        .banner h2 {
            font-size: 40px; /* Kích thước font chữ lớn hơn nữa */
            margin-top: 10px;
            color: #ff6f6f; /* Màu nổi bật hơn */
            font-weight: 700; /* Tăng font-weight */
        }

        .banner p {
            font-size: 18px; /* Tăng kích thước font chữ cho ngày tổ chức */
            margin-top: 10px;
            color: #b85c7a;
        }

        .banner::before,
        .banner::after {
            content: '';
            position: absolute;
            background-image: url('https://preview.iwedding.info/templates/template19/images/flower-medium.svg');
            background-size: cover;
            background-repeat: no-repeat;
            width: 50vw; /* Chiếm một nửa chiều rộng của viewport */
            height: 50vh; /* Chiều cao bằng một nửa chiều cao của viewport */
            z-index: -1; /* Đặt dưới nội dung banner */
        }

        .banner::before {
            top: 50%; /* Đặt giữa banner */
            left: -25vw; /* Di chuyển ra ngoài bên trái */
            transform: translateY(-50%);
        }

        .banner::after {
            top: 50%; /* Đặt giữa banner */
            right: -25vw; /* Di chuyển ra ngoài bên phải */
            transform: translateY(-50%);
        }

        .email-content {
            font-size: 16px;
            line-height: 1.6;
            margin-top: 20px;
        }

        .email-content strong {
            color: #747ba9;
        }

        .email-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
        }

        .family-info {
            margin: 20px 0;
            padding: 10px;
            background-color: #f4f4f4;
            border-radius: 8px;
            color: #333;
        }

        .family-info h3 {
            font-family: 'Marmelad', cursive;
            font-size: 20px;
            color: #747ba9;
        }

        .family-info p {
            font-size: 16px;
            line-height: 1.6;
            margin: 5px 0;
        }

        .images-section {
            margin-top: 30px;
            text-align: center;
        }

        .images-section img {
            max-width: 100%;
            border-radius: 8px;
            margin: 10px 0;
        }

        .email-icons {
            margin-top: 20px;
            text-align: center;
        }

        .email-icons img {
            width: 24px;
            height: 24px;
            margin: 0 5px;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Oooh+Baby&family=Marmelad&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">
</head>

<body>
    <div class="email-container">
        <div class="banner">
            <h1>Văn Đạt <span>&</span> Phương Thảo</h1>
            <h2>Cảm ơn bạn đã xác nhận tham dự</h2>
            <p>Ngày tổ chức cưới: 20/10/2024</p>
            <p>Chúng tôi rất vui mừng được chào đón bạn đến chung vui trong ngày trọng đại này.</p>
        </div>
        <div class="email-content">
            <p>Kính gửi <strong>${detailUser.name}</strong>,</p>
            <p>
                Chúng tôi rất vui mừng khi nhận được xác nhận tham dự tiệc cưới từ bạn. Sự hiện diện của bạn sẽ là niềm vinh dự lớn cho chúng tôi trong ngày trọng đại này.
            </p>
            <p>Dưới đây là thông tin chi tiết về tiệc cưới:</p>
            <p>
                <strong>Ngày:</strong> [Ngày tháng năm]<br>
                <strong>Thời gian:</strong> [Giờ bắt đầu]<br>
                <strong>Địa điểm:</strong> [Tên địa điểm, địa chỉ]
            </p>
        </div>

        <div class="family-info">
            <h3>Thông tin nhà trai</h3>
            <p>Tên chú rể: [Tên chú rể]</p>
            <p>Tên cha mẹ: [Tên cha mẹ chú rể]</p>
            <p>Địa chỉ: [Địa chỉ nhà trai]</p>
        </div>

        <div class="family-info">
            <h3>Thông tin nhà gái</h3>
            <p>Tên cô dâu: [Tên cô dâu]</p>
            <p>Tên cha mẹ: [Tên cha mẹ cô dâu]</p>
            <p>Địa chỉ: [Địa chỉ nhà gái]</p>
        </div>

        <div class="images-section">
            <h3>Hình ảnh về đám cưới</h3>
            <img src="https://bellabridal.vn/public/upload/files/343342550_5955920044504242_5222768225392896037_n.jpg" alt="Wedding Image 1">
            <img src="https://bellabridal.vn/public/upload/files/71777580_3099897656752062_9103140019450675200_o.jpg" alt="Wedding Image 2">
        </div>

        <div class="email-icons">
            <p>Liên hệ với chúng tôi:</p>
            <a href="#"><img src="path_to_your_icon_facebook.png" alt="Facebook" style="width: 24px; height: 24px; margin: 0 5px;"></a>
            <a href="#"><img src="path_to_your_icon_instagram.png" alt="Instagram" style="width: 24px; height: 24px; margin: 0 5px;"></a>
            <a href="#"><img src="path_to_your_icon_phone.png" alt="Phone" style="width: 24px; height: 24px; margin: 0 5px;"></a>
        </div>

        <div class="email-footer">
            Trân trọng,<br>
            [Tên bạn]<br>
            [Số điện thoại liên hệ nếu cần]
        </div>
    </div>
</body>

</html>


        
        `, // html body
    };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            return res.status(404).json({
                message: 'Error when sending email',
            });
        } else {
            console.log('Message sent: ' + response.response);
            return res.status(200).json({
                message: 'Email has been sent',
            });
        }
    });
}
const GetUserDetail= async(req,res)=>{
    try {
        const {_id}=req.params
        if(!_id){
            return res.status(300).json({
                message:"chua co id"
            })
        }
        const detailUsers= await modelUsers.findById(_id)
        if(!detailUsers){
            return res.status(300).json({
                message:"id chua dung"
            })
        }
        return res.status(200).json({
            data:detailUsers
        })
    } catch (error) {
        return res.status(500).json({
            message:error
        })
    }
}
module.exports={CreateUsers,UpdateUsers,DeleteUser,GetUsers,SendEmailClient,GetUserDetail}
