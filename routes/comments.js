const express = require('express');
const router = express.Router();
const comments=require('../controllers/comment')
router.post('/create',comments.CreateComment)
router.post('/update',comments.UpdateComments)
router.delete('/delete/:_id',comments.DeleteComments)
router.get('/get',comments.GetComments)
module.exports = router;