const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY

function verifyToken(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(403).json({ auth: false, message: 'No token provided.' });
    console.log(token)
  jwt.verify(token, secretKey, (err, decoded) => {
    
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    console.log(token)
    req.user = decoded;

 
    next();
  });
}

module.exports = verifyToken;