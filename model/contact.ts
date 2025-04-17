import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  firstName: string;
  lastName:string;
  email: string;
  phone?: string;
  companyId?: string; // Reference to a company
  category: string; // e.g., "lead", "customer", "prospect"
  tags: string[]; // Tags for categorization
  groups: string[]; // Groups the contact belongs to
  lastContact?: Date; // Last time the contact was reached out to
  note:string;
  createdAt: Date;
  updatedAt: Date;
  tenantId: Schema.Types.ObjectId;

}

const ContactSchema: Schema = new Schema<IContact>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    category: { type: String, enum: ['lead', 'customer', 'prospect'], default: 'lead' },
    tags: { type: [String], default: [] },
    groups: { type: [String], default: [] },
    lastContact: { type: Date },
    note: { type: String },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },

  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);