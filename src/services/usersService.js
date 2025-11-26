const usersModel = require('../models/userModel');

const users = usersModel.getMockUsers();

exports.registerUser = (userData) => {
  if (users.find((u) => u.email === userData.email)) {
    return null;
  }
  const hashedPassword = `hashed_${userData.password}`;
  const newUser = {
    id: users.length + 1,
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

exports.loginUser = (email, password) => {
  const hashedPassword = `hashed_${password}`;
  const user = users.find((u) => u.email === email && u.password === hashedPassword);
  if (!user) {
    return null;
  }
  return `mock_jwt_token_${user.id}`;
};
