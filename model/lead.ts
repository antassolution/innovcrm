import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  source: Schema.Types.ObjectId; // "Website", "Referral", "Social Media", etc.
  status: string; // "new", "contacted", "qualified", "lost"
  score: string; // "hot", "warm", "cold"
  assignedTo?: string; // User ID of the assigned sales rep
  notes?: string;
  tenantId: Schema.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema<ILead>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String, required: true },
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterData' },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost'], default: 'new' },
    score: { type: String, enum: ['hot', 'warm', 'cold'], default: 'warm' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },

  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

LeadSchema.index({ createdAt: 1 });



export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);