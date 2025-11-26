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
  const userId = tokenParts[tokenParts.length - 1]; // Keep as string for MongoDB _id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Invalid user ID in token' });
  }
  req.userId = userId;
  next();
};
