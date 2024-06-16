const express = require("express");
const router = express.Router();
const addProblem = require("../controllers/problem/addProblem");
const getAllProblems = require("../controllers/problem/getAllProblems");
const getProblemById = require("../controllers/problem/getProblemById");
const submitProblem = require("../controllers/problem/submitProblem");
const runProblem = require("../controllers/problem/runProblem");
const deleteProblem = require("../controllers/problem/deleteProblem");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

router.post("/add", verifyFirebaseToken, addProblem);
router.get("/all", verifyFirebaseToken, getAllProblems);
router.get("/:problem_id", verifyFirebaseToken, getProblemById);
router.post("/submit/:problem_id", verifyFirebaseToken, submitProblem);
router.post("/run", verifyFirebaseToken, runProblem);
router.delete("/delete/:problem_id", verifyFirebaseToken, deleteProblem);

module.exports = router;
