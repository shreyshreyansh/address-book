import express, { Request, Response } from 'express';
import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';
import { Contact } from '../models/contact';

const router = express.Router();

router.get(
  '/api/contacts/search',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { query } = req.query;

    const result = await Contact.find({
      name: { $regex: query, $options: 'i' },
    }).limit(5);

    res.send(result);
  }
);

export { router as searchContactsRouter };
