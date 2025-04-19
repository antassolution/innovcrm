import dbConnect from "@/lib/dbConnect";
import Tenant from "@/model/tenant";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest,{ params }: { params: { tenantId: string } }) {
  try {
    const { plan } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: plan === "pro" ? process.env.STRIPE_PRO_PLAN_PRICE_ID! : "",
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
    });
    console.log("Checkout session created:", session.id);

    await dbConnect();
        const existingUser = await Tenant.findOneAndUpdate({ _id: params.tenantId },{subscriptionId: session.id, subscriptionStatus:'initiated'});
        if (!existingUser) {
          return NextResponse.json({ success: false, error: "Tenant not found" }, { status: 404 });
        }

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}