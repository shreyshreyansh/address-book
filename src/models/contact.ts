import mongoose from 'mongoose';

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

contactSchema.statics.build = (attrs: ContactAttrs) => {
  return new Contact(attrs);
};

const Contact = mongoose.model<ContactDoc, ContactModel>(
  'Contact',
  contactSchema
);

export { Contact, ContactAttrs, ContactDoc };
