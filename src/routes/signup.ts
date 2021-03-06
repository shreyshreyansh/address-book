import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

// use express-validator as a middleware to check if email and password is valid
// if the email or password is invalid, it will return the string inside withMessage function

// a valid email should follow an actual email format through isEmail()
// a valid password should be of 4>=length<=20
router.post(
  '/api/user/signup',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    /**
     * STEPS:
     * 1. Check the body send by the user using express-validator
     * 2. Check if user exists with the given email address
     * 3. Hash the password
     * 4. Create a new user and store it in DB
     * 5. Send the user a JWT token as a response
     */

    // STEP 1
    // handled by the validateRequest middleware

    const { email, password } = req.body;

    // STEP 2
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // STEP 3
    // STEP 4
    const user = User.build({
      email,
      password,
    });
    await user.save();

    // Simulating STEP 5

    // Generate JWT (Synchronous)
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store JWT on session object provided by cookie-session middleware
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
