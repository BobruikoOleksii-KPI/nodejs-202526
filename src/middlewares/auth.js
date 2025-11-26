/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('mock_jwt_token_')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }
  const tokenParts = authHeader.split('_');
  if (tokenParts.length < 2) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }
  const userIdStr = tokenParts[tokenParts.length - 1];
  const userId = parseInt(userIdStr, 10);
  if (Number.isNaN(userId)) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user ID in token' });
  }
  req.userId = userId;
  next();
};
