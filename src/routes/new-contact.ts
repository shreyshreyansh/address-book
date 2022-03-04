import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import { Contact } from '../models/contact';

const router = express.Router();

router.post(
  '/api/contact',
  currentUser,
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required!'),
    body('phone')
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage('Phone length must be equal to 10!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, street, city, phone } = req.body;

    const contact = Contact.build({
      name,
      street,
      city,
      phone,
      creatorId: req.currentUser!.id,
    });

    await contact.save();

    res.status(201).send(contact);
  }
);

export { router as createContactRouter };
