import { NextResponse } from 'next/server';
import Contact from '@/model/contact';
import dbConnect from '@/lib/dbConnect';
import { ContactActivityModel } from '@/model/contactActivity';

// PATCH: Update multiple contacts at once
export async function PATCH(req: Request, { params }: { params: { tenantId: string } }) {
  const { tenantId } = params;
  const body = await req.json();
  const { contactIds, updates } = body;
  
  if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
    return NextResponse.json(
      { error: 'contactIds array is required and must not be empty' },
      { status: 400 }
    );
  }

  if (!updates || typeof updates !== 'object') {
    return NextResponse.json(
      { error: 'updates object is required' },
      { status: 400 }
    );
  }

  await dbConnect();
  
  try {
    // Update the contacts
    const updateResult = await Contact.updateMany(
      { _id: { $in: contactIds }, tenantId },
      { $set: updates },
      { new: true }
    );
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'No matching contacts found' },
        { status: 404 }
      );
    }

    // Get the updated contacts to use in activity logs
    const updatedContacts = await Contact.find({ _id: { $in: contactIds }, tenantId });
    
    // Check if a note is provided in the updates
    const hasNote = updates.note && updates.note.trim() !== '';
    
    // Create activity logs for each updated contact
    const activityPromises = updatedContacts.map(contact => {
      // If note is provided, use it as the description
      const description = hasNote 
        ? updates.note 
        : `Contact ${contact.firstName} ${contact.lastName || ''} was updated in bulk operation`;
        
      const contactActivity = new ContactActivityModel({
        contactId: contact._id,
        type: 'note',
        title: 'Contact Updated',
        description: description,
        date: new Date(),
        tenantId: tenantId
      });
      return contactActivity.save();
    });
    
    await Promise.all(activityPromises);
    
    return NextResponse.json({
      message: 'Contacts updated successfully',
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error('Error updating contacts:', error);
    return NextResponse.json(
      { error: 'Failed to update contacts' },
      { status: 500 }
    );
  }
}