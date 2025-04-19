import mongoose, { Schema, model, Document } from 'mongoose';
import { SystemSettings } from '@/types';


interface ISettings extends Document, SystemSettings {
  tenantId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmailNotificationsSchema = new Schema({
  newLeads: { type: Boolean, default: true },
  dealUpdates: { type: Boolean, default: true },
  taskReminders: { type: Boolean, default: true },
  dailyDigest: { type: Boolean, default: false },
});

const CompanyInfoSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String },
  address: { type: String },
  phone: { type: String },
  website: { type: String },
  email: { type: String },
});

const SalesSettingsSchema = new Schema({
  defaultSalesTax: { type: Number, default: 0 },
  fiscalYearStart: { type: String, default: '01-01' },

});

const EmailSettingsSchema = new Schema({
  smtpServer: { type: String },
  smtpPort: { type: Number },
  smtpUsername: { type: String },
  smtpPassword: { type: String },
  fromEmail: { type: String },
  emailSignature: { type: String },
});

const SettingsSchema = new Schema<ISettings>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, unique: true },
    currency: { type: String, required: true, default: 'USD' },
    dateFormat: { type: String, required: true, default: 'MM/DD/YYYY' },
    timeZone: { type: String, required: true, default: 'UTC' },
    companyInfo: { 
      type: CompanyInfoSchema, 
      default: () => ({
        name: '',
      }) 
    },
    salesSettings: { 
      type: SalesSettingsSchema, 
      default: () => ({
        defaultSalesTax: 0,
        fiscalYearStart: '01-01',
        dealStages: ['qualification', 'meeting', 'proposal', 'negotiation', 'closing'],
        leadSources: ['website', 'referral', 'social-media', 'event', 'other'],
      }) 
    },
    emailSettings: { 
      type: EmailSettingsSchema, 
      default: () => ({}) 
    },
    emailNotifications: { 
      type: EmailNotificationsSchema, 
      default: () => ({
        newLeads: true,
        dealUpdates: true,
        taskReminders: true,
        dailyDigest: false,
      }) 
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure uniqueness of tenantId
// SettingsSchema.index({ tenantId: 1 }, { unique: true });

SettingsSchema.index({ createdAt: 1 });




const Settings = mongoose.models.Settings || model<ISettings>('Settings', SettingsSchema);

export default Settings;