import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/contact/${id}`)
    .set('Cookie', await global.signup())
    .send()
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/contact/${id}`).send().expect(401);
});

it('returns a 401 if the user does not own the contact', async () => {
  const response = await request(app)
    .post(`/api/contact`)
    .set('Cookie', await global.signup())
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    });

  await request(app)
    .delete(`/api/contact/${response.body.id}`)
    .set('Cookie', await global.signup2()) // different user
    .send()
    .expect(401);
});

it('deletes the contact provided valid id and ownership', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post(`/api/contact`)
    .set('Cookie', cookie)
    .send({
      name: 'Kenny German',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(201);

  const firstResponse = await request(app)
    .get(`/api/contacts?page=1&limit=3`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(firstResponse.body.contacts).toHaveLength(1);

  await request(app)
    .delete(`/api/contact/${response.body.id}`)
    .set('Cookie', cookie)
    .send();

  const secondResponse = await request(app)
    .get(`/api/contacts?page=1&limit=3`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(secondResponse.body.contacts).toHaveLength(0);
});
