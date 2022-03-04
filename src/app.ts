import express from 'express';

// make sure to import it after express
import 'express-async-errors';

import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { currentuserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { createContactRouter } from './routes/new-contact';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { createContactsRouter } from './routes/bulk-contact';
import { showContactRouter } from './routes/show-contact';
import { showContactsRouter } from './routes/show-contacts';
import { searchContactsRouter } from './routes/search-contacts';
import { updateContactRouter } from './routes/update-contact';
import { deleteContactRouter } from './routes/delete-contact';

const app = express();

app.use(json());

app.use(
  cookieSession({
    // as JWT inside is already encrypted and we don't have any
    // other naked secrets inside it, therefore we do not
    // encryt our cookie.
    // Advantage of this is that service written in a different language
    // can use the cookie without worrying about the decryption.
    signed: false,
    // only for development purpose, we are providing cookie on HTTP connection
    secure: false,
  })
);

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(createContactRouter);
app.use(createContactsRouter);
app.use(showContactRouter);
app.use(showContactsRouter);
app.use(searchContactsRouter);
app.use(updateContactRouter);
app.use(deleteContactRouter);

// not found route
// app.all represents GET, POST, PUT, PATCH, etc.
app.all('*', () => {
  // as soon as it throws a not found error, express will capture the
  // error and throw it to the errorHandler as through that the user will
  // get the reponse
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
