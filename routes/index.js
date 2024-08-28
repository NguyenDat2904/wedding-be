var express = require('express');
var router = express.Router();
const loginAdmin= require('../controllers/admin')
router.post("/login_admin",loginAdmin.LoginAdmin)
router.post("/createAdmin",loginAdmin.createAdmin)
module.exports = router;
