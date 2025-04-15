"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const features = {
  free: [
    "Up to 100 contacts",
    "Basic lead tracking",
    "Simple pipeline view",
    "Email support",
    "1 team member",
  ],
  pro: [
    "Unlimited contacts",
    "Advanced lead scoring",
    "Custom pipeline stages",
    "Priority support",
    "Unlimited team members",
    "Custom reporting",
    "API access",
    "Data export",
    "Advanced analytics",
    "Automation workflows",
  ],
};

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan: "pro" }),
    });

    const session = await response.json();

    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) {
        console.error(error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Free Plan
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Current Plan
              </span>
            </CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {features.free.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Pro Plan
                <Zap className="h-5 w-5 text-primary" />
              </CardTitle>
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <CardDescription>For growing businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {features.pro.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCheckout} disabled={loading}>
              {loading ? "Processing..." : "Upgrade to Pro"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 bg-muted p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Need a custom plan?</h2>
        <p className="text-muted-foreground mb-4">
          We offer custom solutions for large enterprises with specific requirements.
          Contact our sales team to discuss your needs.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
}