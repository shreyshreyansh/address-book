import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares/current-user';
import { validateRequest } from '../middlewares/validate-request';
import { NotFoundError } from '../errors/not-found-error';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { requireAuth } from '../middlewares/require-auth';
import { Contact } from '../models/contact';

const router = express.Router();

router.delete(
  '/api/contact/:id',
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      throw new NotFoundError('contact not found');
    }

    if (contact.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await contact.remove();

    res.send({});
  }
);

export { router as deleteContactRouter };
