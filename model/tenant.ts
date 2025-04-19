import mongoose, { Schema, model, Document } from 'mongoose';

interface ITenant extends Document {
  companyName: string;
  subscriptionId?: string;
  subscriptionStatus?: string;

  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    
    companyName: { type: String, required: true },
    subscriptionId: { type: String, required: false },
    subscriptionStatus: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.models.Tenant || model<ITenant>('Tenant', TenantSchema);

export default Tenant;