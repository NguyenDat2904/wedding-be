const express = require('express');
const router = express.Router();
const user= require('../controllers/users')
const verifyToken=require('../middlewaves/authenMiddeware')
router.post('/create',verifyToken,user.CreateUsers)
router.post('/update',verifyToken,user.UpdateUsers)
router.delete('/delete/:_id',verifyToken,user.DeleteUser)
router.get('/get',verifyToken,user.GetUsers)
module.exports = router;
