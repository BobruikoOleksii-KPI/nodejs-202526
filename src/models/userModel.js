const mockUsers = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashed_testpass',
    createdAt: new Date().toISOString(),
  },
];

exports.getMockUsers = () => mockUsers;
