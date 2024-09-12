const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const authHeaders = req.headers.authorization || req.headers.Authorization;

  if (!authHeaders || !authHeaders.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeaders.split(' ')[1];

  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });

    req.user = decoded.userInfo;

    next();
  });
};

module.exports = verifyToken;
