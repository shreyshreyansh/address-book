import request from 'supertest';
import { app } from '../../app';

it('responds with the contact details of the newly created contact', async () => {
  // calls the global function declared in test env
  const cookie = await global.signup();

  const response = await request(app)
    .post('/api/contacts')
    .set('Cookie', cookie)
    .send({
      contacts: [
        {
          name: 'Darrell Wintheiser',
          street: '2250 W 81st Ave',
          city: 'Merrillville',
          phone: '2197696868',
        },
        {
          name: 'Brigitte Wehner',
          street: '621 Signal Mountain Rd',
          city: 'Chattanooga',
          phone: '9985467612',
        },
      ],
    })
    .expect(201);

  expect(response.body[0].name).toEqual('Darrell Wintheiser');
  expect(response.body[0].phone).toEqual('2197696868');
  expect(response.body[1].name).toEqual('Brigitte Wehner');
  expect(response.body[1].phone).toEqual('9985467612');
});

it('cannot create a contact if not authenticated', async () => {
  await request(app)
    .post('/api/contacts')
    .send({
      contacts: [
        {
          name: 'Darrell Wintheiser',
          street: '2250 W 81st Ave',
          city: 'Merrillville',
          phone: '2197696868',
        },
        {
          name: 'Brigitte Wehner',
          street: '621 Signal Mountain Rd',
          city: 'Chattanooga',
          phone: '9985467612',
        },
      ],
    })
    .expect(401);
});

it('cannot create a contact if name or phone is missing', async () => {
  const cookie = await global.signup();
  await request(app)
    .post('/api/contacts')
    .set('Cookie', cookie)
    .send({
      contacts: [
        {
          name: '',
          street: '2250 W 81st Ave',
          city: 'Merrillville',
          phone: '2197696868',
        },
        {
          name: 'Brigitte Wehner',
          street: '621 Signal Mountain Rd',
          city: 'Chattanooga',
          phone: '9985467612',
        },
      ],
    })
    .expect(400);

  await request(app)
    .post('/api/contacts')
    .set('Cookie', cookie)
    .send({
      contacts: [
        {
          name: 'Darrell Wintheiser',
          street: '2250 W 81st Ave',
          city: 'Merrillville',
          phone: '2197696868',
        },
        {
          name: 'Brigitte Wehner',
          street: '621 Signal Mountain Rd',
          city: 'Chattanooga',
          phone: '',
        },
      ],
    })
    .expect(400);
});
