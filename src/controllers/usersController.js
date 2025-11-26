const usersService = require('../services/usersService');

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields: username, email, password' });
  }
  const newUser = usersService.registerUser({ username, email, password });
  if (!newUser) {
    return res.status(409).json({ message: 'User with this email already exists' });
  }
  res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  return undefined;
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }
  const token = usersService.loginUser(email, password);
  if (!token) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ message: 'Login successful', token });
  return undefined;
};
