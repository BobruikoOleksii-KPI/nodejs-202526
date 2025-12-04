const usersService = require('../services/usersService');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Missing required fields: username, email, password' });
      return;
    }
    const newUser = await usersService.registerUser({ username, email, password });
    if (!newUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Missing email or password' });
      return;
    }
    const token = await usersService.loginUser(email, password);
    if (!token) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
