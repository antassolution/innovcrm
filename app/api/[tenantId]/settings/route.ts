import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/model/settings';
import mongoose from 'mongoose';
import { systemSettingsSchema } from '@/types';

// GET - Retrieve settings for a tenant
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    await dbConnect();
    const tenantId = params.tenantId;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: 'Invalid tenant ID' }, { status: 400 });
    }
    
    let settings = await Settings.findOne({ tenantId: new mongoose.Types.ObjectId(tenantId) });
    
    // If settings don't exist yet, create default settings
    if (!settings) {
      const defaultSettings = new Settings({
        tenantId: new mongoose.Types.ObjectId(tenantId),
        companyInfo: {
          name: 'Your Company Name',
        },
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeZone: 'UTC',
        salesSettings: {
          defaultSalesTax: 0,
          fiscalYearStart: '01-01',
          dealStages: ['qualification', 'meeting', 'proposal', 'negotiation', 'closing'],
          leadSources: ['website', 'referral', 'social-media', 'event', 'other'],
        },
        emailNotifications: {
          newLeads: true,
          dealUpdates: true,
          taskReminders: true,
          dailyDigest: false,
        },
      });
      
      settings = await defaultSettings.save();
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update settings for a tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    await dbConnect();
    const tenantId = params.tenantId;
    
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: 'Invalid tenant ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate the request body
    const validationResult = systemSettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid settings data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const updatedSettings = await Settings.findOneAndUpdate(
      { tenantId: new mongoose.Types.ObjectId(tenantId) },
      validationResult.data,
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}