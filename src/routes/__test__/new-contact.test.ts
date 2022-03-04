import request from 'supertest';
import { app } from '../../app';

it('responds with the contact details of the newly created contact', async () => {
  // calls the global function declared in test env
  const cookie = await global.signup();

  const response = await request(app)
    .post('/api/contact')
    .set('Cookie', cookie)
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(201);

  expect(response.body.name).toEqual('Kenny Keebler');
  expect(response.body.phone).toEqual('9986252612');
});

it('cannot create a contact if not authenticated', async () => {
  await request(app)
    .post('/api/contact')
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(401);
});

it('cannot create a contact if name or phone is missing', async () => {
  const cookie = await global.signup();
  await request(app)
    .post('/api/contact')
    .set('Cookie', cookie)
    .send({
      name: '',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(400);

  await request(app)
    .post('/api/contact')
    .set('Cookie', cookie)
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '',
    })
    .expect(400);
});
