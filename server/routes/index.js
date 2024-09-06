var express = require('express');
var router = express.Router();
const authController = require('../controller/authController')

/* GET home page. */

router.post('/', authController.login)

module.exports = router;
