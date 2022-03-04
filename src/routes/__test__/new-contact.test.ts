import request from 'supertest';
import { app } from '../../app';

it('responds with the contact details of the newly created contact', async () => {
  // calls the global function declared in test env
  const cookie = await global.signup();

  const response = await request(app)
    .get('/api/user/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/user/currentuser')
    .send()
    .expect(401);

  expect(response.body.currentUser).toEqual(undefined);
});
