import express, { Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error';
import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';
import { Contact } from '../models/contact';

const router = express.Router();

router.get(
  '/api/contact/:id',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) throw new NotFoundError('contact not found!');

    res.send(contact);
  }
);

export { router as showContactRouter };
