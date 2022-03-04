import mongoose from 'mongoose';

import { Password } from '../services/password';

// An interface that describes the properties that are
// required to create a new User
// (what it takes to create a user)
interface UserAttrs {
  email: string;
  password: string;
}

// An inteface that describes the properties that a User Model has
// (what entire collection of users looks like)
// The reason for making this interafe is the using userSchema.statics.build
// doesn't inform TS that User model will have a build() function.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
// (what properties a single user has)

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // mongoose will use this to covert its object to json
    // therefore we can customize it to the response we want
    // to give to the client
    toJSON: {
      /**
       *
       * @param doc The mongoose document which is being converted
       * @param ret The plain object representation which has been converted
       */
      transform(doc, ret) {
        // we don't want to show password property in any JSON representation
        delete ret.password;

        // we don't want to show version property in any JSON representation
        delete ret.__v;

        // renaming _id to id
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// mongoose pre save hook to hash the password before storing it into the database
userSchema.pre('save', async function (done) {
  // use case: this function will run even if we update an existing customer in the collection
  // so if the user changes the email, we will again hash the hashed password therefore we will
  // first check if the user's password is modified then only do the hashing
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  // as mongoose is an old library it does not handle async await therefore it provides us with a
  // callback function done to know when the function is over
  done();
});

// we will call this function from our model every time we will create a new user
// instead of using plain new User(), because using the function we can
// use the typescript functionality as compared to the naked mongoose function
// new User()
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
