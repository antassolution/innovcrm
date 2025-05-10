import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, BarChart3, Users, Target, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate pt-14 bg-gradient-to-b from-primary-light/10 to-transparent">
        <div className="container mx-auto px-4 py-32 sm:py-48">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your Sales Process with
              <span className="text-primary block mt-2">Intelligent CRM</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Streamline your workflow, boost productivity, and close more deals with our powerful and intuitive CRM platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg" className="shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed to help you manage and grow your business effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Contact Management</h3>
              <p className="text-gray-600">Organize and track all your customer interactions in one place.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lead Tracking</h3>
              <p className="text-gray-600">Never miss an opportunity with our advanced lead management system.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sales Analytics</h3>
              <p className="text-gray-600">Make data-driven decisions with powerful insights and reporting.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Automation</h3>
              <p className="text-gray-600">Streamline your workflow with smart automation tools.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl border">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-gray-600 mt-2">Perfect for getting started</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Up to 100 contacts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Basic deal tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link href="/register?plan=free">
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            {/* <div className="bg-primary text-white p-8 rounded-xl border-2 border-primary shadow-lg relative">
              <div className="absolute -top-4 right-4">
                <span className="bg-accent text-white text-sm font-medium px-3 py-1 rounded-full">
                  Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-primary-foreground/80 mt-2">For growing businesses</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold">$3</span>
                <span className="text-primary-foreground/80">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Unlimited contacts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Advanced pipeline management</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Custom reports & analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Team collaboration tools</span>
                </li>
              </ul>
              <Link href="/register?plan=pro">
                <Button className="w-full bg-white text-primary hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}