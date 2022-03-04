import mongoose from 'mongoose';

// An interface that describes the properties that are
// required to create a new Contact
// (what it takes to create a Contact)
interface ContactAttrs {
  name: string;
  street: string;
  city: string;
  phone: string;
  creatorId: string;
}

interface ContactDoc extends mongoose.Document {
  name: string;
  street: string;
  city: string;
  phone: string;
  creatorId: string;
}

// An inteface that describes the properties that a Contact Model has
// (what entire collection of Contacts looks like)
// The reason for making this interafe is the using ContactSchema.statics.build
// doesn't inform TS that Contact model will have a build() function.
interface ContactModel extends mongoose.Model<ContactDoc> {
  build(attrs: ContactAttrs): ContactDoc;
}

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
  },
  {
    // mongoose will use this to covert its object to json
    // therefore we can customize it to the response we want
    // to give to the client
    toJSON: {
      transform(doc, ret) {
        // we don't want to show version property in any JSON representation
        delete ret.__v;

        // renaming _id to id
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// we will call this function from our model every time we will create a new Contact
// instead of using plain new Contact(), because using the function we can
// use the typescript functionality as compared to the naked mongoose function
// new Contact()

contactSchema.statics.build = (attrs: ContactAttrs) => {
  return new Contact(attrs);
};

const Contact = mongoose.model<ContactDoc, ContactModel>(
  'Contact',
  contactSchema
);

export { Contact, ContactAttrs, ContactDoc };
