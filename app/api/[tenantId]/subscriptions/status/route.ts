import dbConnect from "@/lib/dbConnect";
import Tenant from "@/model/tenant";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function GET(req: NextRequest,{ params }: { params: { tenantId: string } }) {

  if ( params.tenantId === undefined) {
    return NextResponse.json({ success: false, error: "Invalid session ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const existingUser = await Tenant.findOne({ _id: params.tenantId });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });
    }
    const paymentStatus = existingUser.subscriptionStatus || "unpaid";
    console.log("paymentStatus", paymentStatus);

  
    return NextResponse.json({ success: true, paymentStatus }, { status: 200 });
    
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { tenantId: string } }) {
  // Get session ID from query string
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 });
  }

  if (params.tenantId === undefined) {
    return NextResponse.json({ success: false, error: "Invalid tenant ID" }, { status: 400 });
  }

  try {
    // Connect to the database
    await dbConnect();

    // Retrieve the session from Stripe to verify payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Retrieved Stripe session:", session.id);
    
    // Check the payment status
    let subscriptionStatus = "unpaid";
    
    if (session.payment_status === "paid") {
      subscriptionStatus = "paid";
    } else if (session.payment_status === "unpaid") {
      subscriptionStatus = "unpaid";
    } else {
      subscriptionStatus = "pending";
    }

    // Update tenant subscription status in the database
    const updatedTenant = await Tenant.findOneAndUpdate(
      { _id: params.tenantId },
      { subscriptionStatus },
      { new: true }
    );

    if (!updatedTenant) {
      return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      paymentStatus: subscriptionStatus,
      sessionId: session.id,
      customerEmail: session.customer_email || "Not provided",
    }, { status: 200 });

  } catch (error) {
    console.error("Error validating session:", error);
    return NextResponse.json({ success: false, error: "Failed to validate payment session" }, { status: 500 });
  }
}