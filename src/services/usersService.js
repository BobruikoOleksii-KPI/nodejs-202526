const User = require('../models/userModel');

exports.registerUser = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) return null;
  const newUser = new User({ ...userData, password: `hashed_${userData.password}` });
  await newUser.save();
  return newUser;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email, password: `hashed_${password}` });
  if (!user) return null;
  return `mock_jwt_token_${user._id}`;
};
