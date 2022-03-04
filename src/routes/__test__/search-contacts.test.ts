import request from 'supertest';
import { app } from '../../app';

it('search contacts through name phrases', async () => {
  // creates eight contacts
  const cookie = await global.signup();
  await request(app)
    .post('/api/contact')
    .set('Cookie', cookie)
    .send({
      name: 'Kenny Keebler',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(201);

  await request(app)
    .post('/api/contact')
    .set('Cookie', cookie)
    .send({
      name: 'Kenn Rogger',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(201);

  await request(app)
    .post('/api/contact')
    .set('Cookie', cookie)
    .send({
      name: 'Apollo German',
      street: '1644 E Highland Ave #101',
      city: 'San Bernardino',
      phone: '9986252612',
    })
    .expect(201);

  const firstResponse = await request(app)
    .get(`/api/contacts/search?query=Ken`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const secondResponse = await request(app)
    .get(`/api/contacts/search?query=Ger`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const thirdResponse = await request(app)
    .get(`/api/contacts/search?query=`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(firstResponse.body).toHaveLength(2);
  expect(secondResponse.body).toHaveLength(2);
  expect(thirdResponse.body).toHaveLength(3);
});
