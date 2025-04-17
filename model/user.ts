import mongoose, { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  firstName: string;
  lastName: string
  email: string;
  password: string;
  role: string;
  tenantId: Schema.Types.ObjectId;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'sales-mgr', 'sales-rep','user'] },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    status: { type: String, required: true, enum: ['active', 'disabled'] },

  },
  {
    timestamps: true,
  }
);

UserSchema.pre('validate', function (next) {
  if (!this.firstName && this.name) {
    const [first, ...rest] = this.name.split(' ');
    this.firstName = first;
    this.lastName = rest.join(' ') || '';
  }
  next();
});

const User = mongoose.models.User || model<IUser>('User', UserSchema);

export default User;