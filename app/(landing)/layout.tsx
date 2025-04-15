import { LandingHeader } from '@/components/layout/LandingHeader';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>{children}</main>
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2024 SalesPro CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}