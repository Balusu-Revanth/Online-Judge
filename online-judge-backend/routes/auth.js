const express = require('express');
const router = express.Router();
const signUp = require('../controllers/auth/signUp');
const signIn = require('../controllers/auth/signIn');
const deleteUser = require('../controllers/auth/deleteUser');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

router.post('/signup', verifyFirebaseToken, signUp);
router.post('/signin', verifyFirebaseToken, signIn);
router.delete('/delete-user', verifyFirebaseToken, deleteUser);

module.exports = router;
