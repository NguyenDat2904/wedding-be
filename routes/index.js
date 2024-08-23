var express = require('express');
var router = express.Router();
const loginAdmin= require('../controllers/admin')
router.post("/login_admin",loginAdmin)

module.exports = router;
