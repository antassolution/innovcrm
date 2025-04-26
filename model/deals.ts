import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  value: number;
  customerId: mongoose.Types.ObjectId;

  // stageId represents the current pipeline stage (e.g., Qualification, Proposal, Negotiation)
  stageId: mongoose.Types.ObjectId;

  probability: number;
  expectedCloseDate: Date;
  notes?: string;
  assignedTo: mongoose.Types.ObjectId;

  // status represents the deal's overall state - active (in progress), or final outcome (won/lost)
  status: 'active' | 'won' | 'lost';

  lostReason?: string;
  lastContactDate?: Date;
  nextActionDate?: Date;
  nextActionDescription?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  tenantId?:mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, 'Deal value is required'],
      min: [0, 'Deal value cannot be negative'],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: [true, 'Customer is required'],
    },

    // stageId represents the current pipeline stage (e.g., Qualification, Proposal, Negotiation)
    stageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterData',
      required: [true, 'Deal stage is required'],
    },

    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 20,
      required: true,
    },
    expectedCloseDate: {
      type: Date,
      required: [true, 'Expected close date is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Deal must be assigned to a user'],
    },

    // Overall deal status - active deals are still in progress, won/lost are closed
    status: {
      type: String,
      enum: ['active', 'won', 'lost'],
      default: 'active',
    },

    lostReason: {
      type: String,
      trim: true,
    },
    lastContactDate: {
      type: Date,
    },
    nextActionDate: {
      type: Date,
    },
    nextActionDescription: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    tenantId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
DealSchema.index({ customerId: 1 });
DealSchema.index({ assignedTo: 1 });
DealSchema.index({ stageId: 1 });
DealSchema.index({ status: 1 });
DealSchema.index({ nextActionDate: 1 });
DealSchema.index({ createdAt: 1 });



export default mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);
