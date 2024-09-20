const express=require('express')
const router=express.Router()
const spending= require('../controllers/spending')
const verifyToken=require('../middlewaves/authenMiddeware')
router.post('/create',verifyToken,spending.CreateSpending)
router.post('/update/:_id',verifyToken,spending.UpdateSpending)
router.delete('/delete/:_id',verifyToken,spending.DeleteSpending)
router.get('/get',spending.GetSpending)
module.exports=router;

