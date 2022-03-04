import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/contact/${id}`)
    .set('Cookie', await global.signup())
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/contact/${id}`)
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(401);
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
    .put(`/api/contact/${response.body.id}`)
    .set('Cookie', await global.signup2()) // different user
    .send({
      name: 'Kenny German',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(401);
});

it('returns a 400 if the user provides a missing name or phone or city or street', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post(`/api/contact`)
    .set('Cookie', cookie)
    .send({
      name: '',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    });

  await request(app)
    .put(`/api/contact/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Kenny German',
      street: '',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(400);

  await request(app)
    .put(`/api/contact/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Kenny German',
      street: '1644 E Highland Ave #101',
      city: '',
      phone: '9986252612',
    })
    .expect(400);

  await request(app)
    .put(`/api/contact/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Kenny German',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '',
    })
    .expect(400);
});

it('updates the contact provided valid inputs', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post(`/api/contact`)
    .set('Cookie', cookie)
    .send({
      name: 'Kenny German',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    });

  await request(app)
    .put(`/api/contact/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(200);

  const contactResponse = await request(app)
    .get(`/api/contact/${response.body.id}`)
    .set('Cookie', cookie)
    .send();

  expect(contactResponse.body.name).toEqual('Kenny Keebler');
});
