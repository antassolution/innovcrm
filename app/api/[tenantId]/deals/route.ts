import { NextRequest, NextResponse } from 'next/server';
import dbConnect  from '@/lib/dbConnect';
import Deal from '@/model/deals';
import mongoose from 'mongoose';



// GET handler - retrieve all deals or a specific deal by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    // Validate tenantId
   
    // Extract query parameters for filtering
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const stageId = searchParams.get('stageId');
    const assignedTo = searchParams.get('assignedTo');

    // Build query
    const query: Record<string, any> = {};
    
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      query._id = id;
    }
    
    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      query.customerId = customerId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (stageId && mongoose.Types.ObjectId.isValid(stageId)) {
      query.stageId = stageId;
    }
    
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      query.assignedTo = assignedTo;
    }
    await dbConnect();
    // Fetch data
    let data;
    if (id) {
      // Get a specific deal
      data = await Deal.findOne(query)
      //  .populate('customerId', 'name email company')
        .populate('assignedTo', 'name email')
        .populate('stageId', 'name');
        
      if (!data) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }
    } else {
      // List all deals with optional filtering
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;
      
      data = await Deal.find(query)
      //  .populate('customerId', 'name email company')
       // .populate('assignedTo', 'name email')
       // .populate('stageId', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        
      const total = await Deal.countDocuments(query);
      
      return NextResponse.json({
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// POST handler - create a new deal
export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    // Validate tenantId

    await dbConnect();
    const body = await request.json();
    
    // Create a new deal
    const newDeal = new Deal({...body,tenantId: params.tenantId});
    const savedDeal = await newDeal.save();

    return NextResponse.json({ data: savedDeal }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating deal:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json(
        { error: 'Validation error', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}


