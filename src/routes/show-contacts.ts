import express, { Request, Response } from 'express';
import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';
import { Contact, ContactDoc } from '../models/contact';

interface Result {
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
  contacts: ContactDoc[];
}

const router = express.Router();

router.get(
  '/api/contacts',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;

    let result: Result = {
      contacts: await Contact.find({}).limit(limit).skip(startIdx),
    };

    if (endIdx < (await Contact.count({}))) {
      result.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIdx > 0) {
      result.previous = {
        page: page - 1,
        limit,
      };
    }

    res.send(result);
  }
);

export { router as showContactsRouter };
