const express = require('express');
const router = express.Router();
const addProblem = require('../controllers/problem/addProblem');
const getAllProblems = require('../controllers/problem/getAllProblems');
const getProblemById = require('../controllers/problem/getProblemById');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

router.post('/add', verifyFirebaseToken, addProblem);
router.get('/all', verifyFirebaseToken, getAllProblems);
router.get('/:id', verifyFirebaseToken, getProblemById);

module.exports = router;
