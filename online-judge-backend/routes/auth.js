const express = require("express");
const router = express.Router();
const signUp = require("../controllers/auth/signUp");
const signIn = require("../controllers/auth/signIn");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

router.post("/signup", verifyFirebaseToken, signUp);
router.post("/signin", verifyFirebaseToken, signIn);

module.exports = router;
