"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContactForm } from "@/components/contacts/ContactForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewContactPage() {
  const [saveAndCreate, setSaveAndCreate] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    if (saveAndCreate) {
      router.refresh();
    } else {
      router.push("/contacts");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4">
            <Link href="/contacts">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Contact</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ContactForm
            onSuccess={handleSuccess}
            saveAndCreate={saveAndCreate}
            onSaveAndCreateChange={setSaveAndCreate}
          />
        </div>
      </div>
    </div>
  );
}