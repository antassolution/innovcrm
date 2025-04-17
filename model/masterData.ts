import mongoose, { Document, Schema } from "mongoose";

export interface MasterData {
    id: string;
    category: string;
    name: string;
    value: string;
    displayOrder?: number;
    isActive: boolean;
    tenantId: Schema.Types.ObjectId;

    createdAt: string;
    updatedAt: string;
  }

const masterDataSchema = new Schema<MasterData & Document>(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for faster querying
masterDataSchema.index({ category: 1, isActive: 1 });

// Create or retrieve the model
export const MasterDataModel = mongoose.models.MasterData || 
  mongoose.model<MasterData & Document>("MasterData", masterDataSchema);

export default MasterDataModel;