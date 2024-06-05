const express = require('express');
const addProblem = require('../controllers/problem/addProblem');
const getAllProblems = require('../controllers/problem/getAllProblems');
const router = express.Router();

router.post('/add', addProblem);
router.get('/all', getAllProblems);

module.exports = router;
