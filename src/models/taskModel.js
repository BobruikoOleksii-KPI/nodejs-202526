const mockTasks = [
  {
    id: 1,
    title: 'Sample Task 1',
    description: 'This is a test task',
    dueDate: '2025-12-01',
    priority: 'medium',
    status: 'pending',
    userId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Sample Task 2',
    description: 'Another test',
    dueDate: '2025-11-25',
    priority: 'high',
    status: 'in-progress',
    userId: 1,
    createdAt: new Date().toISOString(),
  },
];

exports.getMockTasks = () => mockTasks;
