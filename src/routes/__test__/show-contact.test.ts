import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('fetch the contact details with correct contact id', async () => {
  // calls the global function declared in test env
  const cookie = await global.signup();

  const createdContact = await request(app)
    .post('/api/contact')
    .set('Cookie', cookie)
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/contact/${createdContact.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.name).toEqual('Kenny Keebler');
  expect(response.body.phone).toEqual('9986252612');
});

it('gets not found with incorrect contact id', async () => {
  // calls the global function declared in test env
  const cookie = await global.signup();

  const response = await request(app)
    .get(`/api/contact/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send()
    .expect(404);
});
