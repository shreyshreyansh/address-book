import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser } from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { requireAuth } from '../middlewares/require-auth';
import { Contact } from '../models/contact';

const router = express.Router();

router.put(
  '/api/contact/:id',
  currentUser,
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required!'),
    body('street').not().isEmpty().withMessage('Street is required!'),
    body('city').not().isEmpty().withMessage('City is required!'),
    body('phone')
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage('Phone length must be equal to 10!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      throw new NotFoundError('contact not found');
    }

    // check if the currentUser is the owner of the contact
    if (contact.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // update the contact
    contact.set({
      name: req.body.name,
      street: req.body.street,
      city: req.body.city,
      phone: req.body.phone,
    });

    await contact.save();

    res.send(contact);
  }
);

export { router as updateContactRouter };
