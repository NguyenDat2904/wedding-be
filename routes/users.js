const express = require('express');
const router = express.Router();
const user= require('../controllers/users')
const verifyToken=require('../middlewaves/authenMiddeware')
router.post('/create',verifyToken,user.CreateUsers)
router.post('/update/:_id',verifyToken,user.UpdateUsers)
router.post('/sendEmail',verifyToken,user.SendEmailClient)
router.delete('/delete/:_id',verifyToken,user.DeleteUser)
router.get('/get',user.GetUsers)
module.exports = router;
