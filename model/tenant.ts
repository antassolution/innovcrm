import mongoose, { Schema, model, Document } from 'mongoose';

interface ITenant extends Document {
  companyName: string;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    
    companyName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.models.Tenant || model<ITenant>('Tenant', TenantSchema);

export default Tenant;