const express = require('express');
const { getUsers, Register, Login, logout } = require('../controller/Users');
const jwtVerify = require('../middleware/tokenValidation');
const refreshToken = require('../controller/refreshToken');

const router = express.Router();

router.get('/users', jwtVerify, getUsers);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', logout);

module.exports = router;
