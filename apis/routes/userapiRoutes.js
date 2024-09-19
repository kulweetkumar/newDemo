var express = require("express");
var router = express.Router();
const helper = require("../helper/helper");
const AuthApis = require("../controllers/authController");
const UserApis = require("../controllers/usersController");

module.exports = (io) => {    
    //////////////////////////// middleware user here  //////////////////////////////
    // auth apis //
    
    router.use(helper.verifykey);
    router.post("/login", AuthApis.login);

    router.use(helper.verifyUser);
    router.post("/register", AuthApis.signup);
    router.get("/get-user-list", AuthApis.getAllUser);
    router.post("/changes-status", AuthApis.changesStatus);

    
    // router.use (middleware.Auth);
    // otp and resend apis
    router.post("/logout", UserApis.logout);
    return router;
};
// module.exports = router;
