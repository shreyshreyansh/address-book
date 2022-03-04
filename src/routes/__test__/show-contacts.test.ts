import request from 'supertest';
import { app } from '../../app';

const createContact = async (cookie: string[]) => {
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
};

it('fetch paginated contact details', async () => {
  // creates eight contacts
  const cookie = await global.signup();
  await createContact(cookie);
  await createContact(cookie);
  await createContact(cookie);
  await createContact(cookie);
  await createContact(cookie);
  await createContact(cookie);
  await createContact(cookie);
  await createContact(cookie);

  const firstResponse = await request(app)
    .get(`/api/contacts?page=1&limit=3`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const secondResponse = await request(app)
    .get(`/api/contacts?page=2&limit=3`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const thirdResponse = await request(app)
    .get(`/api/contacts?page=3&limit=3`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(firstResponse.body).toHaveProperty('next');
  expect(firstResponse.body.next.page).toEqual(2);
  expect(firstResponse.body.next.limit).toEqual(3);
  expect(secondResponse.body).toHaveProperty('next');
  expect(secondResponse.body.next.page).toEqual(3);
  expect(secondResponse.body.next.limit).toEqual(3);
  expect(thirdResponse.body).not.toHaveProperty('next');

  expect(firstResponse.body).not.toHaveProperty('previous');
  expect(secondResponse.body).toHaveProperty('previous');
  expect(secondResponse.body.previous.page).toEqual(1);
  expect(secondResponse.body.previous.limit).toEqual(3);
  expect(thirdResponse.body).toHaveProperty('previous');
  expect(thirdResponse.body.previous.page).toEqual(2);
  expect(thirdResponse.body.previous.limit).toEqual(3);

  expect(firstResponse.body).toHaveProperty('contacts');
  expect(firstResponse.body.contacts).toHaveLength(3);
  expect(secondResponse.body).toHaveProperty('contacts');
  expect(secondResponse.body.contacts).toHaveLength(3);
  expect(thirdResponse.body).toHaveProperty('contacts');
  expect(thirdResponse.body.contacts).toHaveLength(2);
});
