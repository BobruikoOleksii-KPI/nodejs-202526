describe('Task Manager E2E Tests', () => {
  const baseUrl = 'http://localhost:3000/api';

  let token;
  let taskId;
  const timestamp = Date.now();
  const email = `e2e${timestamp}@example.com`;

  before(() => {
    cy.request('POST', `${baseUrl}/users/register`, {
      // IMPORTANT: before each e2e run, change username to something random
      // Cypress can't handle multiple registration attempts
      username: 'e2euser',
      email: email,
      password: 'pass123',
    }).then((regRes) => {
      expect(regRes.status).to.eq(201);
    });

    cy.request('POST', `${baseUrl}/users/login`, {
      email: email,
      password: 'pass123',
    }).then((loginRes) => {
      expect(loginRes.status).to.eq(200);
      token = loginRes.body.token;
    });
  });

  it('creates a task and verifies', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/tasks`,
      headers: { Authorization: token },
      body: {
        title: 'E2E Task',
        description: 'Desc',
        dueDate: '2025-12-01',
        priority: 'medium',
        status: 'pending',
      },
    }).then((taskRes) => {
      expect(taskRes.status).to.eq(201);
      expect(taskRes.body.title).to.eq('E2E Task');
      taskId = taskRes.body._id;
    });
  });

  it('reads all tasks', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/tasks`,
      headers: { Authorization: token },
    }).then((allRes) => {
      expect(allRes.status).to.eq(200);
      expect(allRes.body.length).to.be.at.least(1);
    });
  });

  it('reads single task', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/tasks/${taskId}`,
      headers: { Authorization: token },
    }).then((singleRes) => {
      expect(singleRes.status).to.eq(200);
      expect(singleRes.body.title).to.eq('E2E Task');
    });
  });

  it('updates task', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/tasks/${taskId}`,
      headers: { Authorization: token },
      body: { status: 'completed', description: 'Updated Desc' },
    }).then((updateRes) => {
      expect(updateRes.status).to.eq(200);
      expect(updateRes.body.status).to.eq('completed');
    });
  });

  it('deletes task', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/tasks/${taskId}`,
      headers: { Authorization: token },
    }).then((deleteRes) => {
      expect(deleteRes.status).to.eq(204);
    });
  });

  it('gets overdue tasks', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/tasks`,
      headers: { Authorization: token },
      body: { title: 'Overdue E2E', dueDate: '2023-01-01', status: 'pending' },
    }).then(() => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/tasks/overdue`,
        headers: { Authorization: token },
      }).then((overdueRes) => {
        expect(overdueRes.status).to.eq(200);
        expect(overdueRes.body.length).to.be.at.least(1);
        expect(overdueRes.body[0].title).to.eq('Overdue E2E');
      });
    });
  });

  it('POST /api/tasks returns 401 if no token', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/tasks`,
      body: { title: 'No Token Task' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.contain('Unauthorized');
    });
  });

  it('GET /api/tasks/:id returns 404 if task not found', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/tasks/invalidid123`,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message).to.contain('Task not found');
    });
  });

  it('PUT /api/tasks/:id returns 404 if task not found', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/tasks/invalidid123`,
      headers: { Authorization: token },
      body: { status: 'completed' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message).to.contain('Task not found');
    });
  });

  it('DELETE /api/tasks/:id returns 404 if task not found', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/tasks/invalidid123`,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message).to.contain('Task not found');
    });
  });

  it('POST /api/users/register returns 409 if duplicate email', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/users/register`,
      body: { username: 'dupuser', email: 'e2e@example.com', password: 'pass123' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(409);
      expect(res.body.message).to.contain('User with this email already exists');
    });
  });
});
