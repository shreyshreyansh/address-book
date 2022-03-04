import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import { Contact, ContactAttrs } from '../models/contact';

const router = express.Router();

router.post(
  '/api/contacts',
  currentUser,
  requireAuth,
  [
    body('contacts')
      .isArray()
      .isLength({ min: 1 })
      .withMessage('Contacts should contain an array of contact!'),
    body('contacts.*.name').not().isEmpty().withMessage('Name is required!'),
    body('contacts.*.phone')
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage('Phone length must be equal to 10!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // const { name, street, city, phone } = req.body;

    // const contact = Contact.build({
    //   name,
    //   street,
    //   city,
    //   phone,
    //   creatorId: req.currentUser!.id,
    // });

    // await contact.save();

    const { contacts } = req.body;

    const contactsRes: ContactAttrs[] = [];
    for (let i = 0; i < contacts.length; i++) {
      const contact = Contact.build({
        name: contacts[i].name,
        street: contacts[i].street,
        city: contacts[i].city,
        phone: contacts[i].phone,
        creatorId: req.currentUser!.id,
      });

      await contact.save();
      contactsRes.push(contact);
    }

    res.status(201).send(contactsRes);
  }
);

export { router as createContactsRouter };
