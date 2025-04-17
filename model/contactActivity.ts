import mongoose, { Schema, Document } from 'mongoose';

export interface ContactActivity extends Document {
  contactId: mongoose.Types.ObjectId;
  type: 'email' | 'call' | 'meeting' | 'note';
  title: string;
  description: string;
  date: Date;
}

const ContactActivitySchema = new Schema<ContactActivity>({
  contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
  type: { type: String, enum: ['email', 'call', 'meeting', 'note'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});

const ContactActivityModel = mongoose.models.ContactActivity || mongoose.model<ContactActivity>('ContactActivity', ContactActivitySchema);

export { ContactActivityModel };