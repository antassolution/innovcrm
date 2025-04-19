import dbConnect from "@/lib/dbConnect";
import Tenant from "@/model/tenant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,{ params }: { params: { tenantId: string } }) {

  if ( params.tenantId === undefined) {
    return NextResponse.json({ success: false, error: "Invalid session ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const existingUser = await Tenant.findOne({ _id: params.tenantId });
    if (!existingUser) {
      return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });
    }
    const paymentStatus = existingUser.subscriptionStatus || "unpaid";
    return NextResponse.json({ success: true, paymentStatus }, { status: 200 });
    
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}