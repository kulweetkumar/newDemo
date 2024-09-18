var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/chagepassword', function(req, res,) {
let token = req.query.token
  res.render('chagepassword',{token})
  // res.send("vikas")
});

module.exports = router;
