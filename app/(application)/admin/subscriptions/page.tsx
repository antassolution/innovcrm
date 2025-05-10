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
import { useState, useEffect } from "react";
import { createCheckoutSession, getSubscriptionStatus } from '@/services/subscriptionService';

const stripePromise = loadStripe('pk_test_51RDiNK09P1PAklhLZRGLV8FAHEPg9Q5et9l5YTbSTqsK9sKwm98mSNgonNKD93NQND7UsAnMvhd5Um6N3pD6Ipb900cC0duuLj');

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
  const [isProPlan, setIsProPlan] = useState(false);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        
        const status = await getSubscriptionStatus();
        setIsProPlan(status === 'paid');
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    try {
      const session = await createCheckoutSession('pro');

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
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
              {!isProPlan && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Current Plan
                </span>
              )}
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
          
        </Card>

        {/* Pro Plan */}
        {/* <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Pro Plan
                <Zap className="h-5 w-5 text-primary" />
              </CardTitle>
              {isProPlan && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Current Plan
                </span>
              )}
            </div>
            <CardDescription>For growing businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">$3</span>
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
            <Button className="w-full" onClick={handleCheckout} disabled={loading || isProPlan}>
              {loading ? "Processing..." : isProPlan ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </CardFooter>
        </Card> */}
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