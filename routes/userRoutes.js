const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyJWT');

const {
  getAllUsers,
  createUser,
  userLogin,
} = require('../controllers/userController');

router.get('/', verifyToken, getAllUsers);
router.post('/create-user', createUser);
router.post('/user-login', userLogin);

module.exports = router;
