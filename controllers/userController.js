const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length < 1)
      return res.status(400).json({ message: 'No users available' });

    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password required' });

  try {
    const duplicate = await User.findOne({ email });
    if (duplicate)
      return res
        .status(409)
        .json({ message: `A user with ${email} email already exists.` });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    res
      .status(201)
      .json({ message: `New user with ${user.email} email was created.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password required.' });

  try {
    const user = await User.findOne({ email });

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res
        .status(401)
        .json({ message: 'Unauthorized, incorrect password.' });

    const accessToken = await jwt.sign(
      {
        userInfo: {
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  userLogin,
};
