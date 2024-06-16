const express = require("express");
const router = express.Router();
const getUser = require("../controllers/user/getUser");
const deleteUser = require("../controllers/user/deleteUser");
const solvedProblems = require("../controllers/user/solvedProblems");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

router.get("/get-user", verifyFirebaseToken, getUser);
router.delete("/delete-user", verifyFirebaseToken, deleteUser);
router.get("/solved-problems", verifyFirebaseToken, solvedProblems);

module.exports = router;
