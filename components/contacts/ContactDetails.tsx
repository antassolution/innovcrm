"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/types";
import { contactService } from "@/services/contactService";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactActivityLog } from "@/components/contacts/ContactActivityLog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ContactDetails({ id }: { id: string }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await contactService.getContactById(id);
        setContact(data || null);
      } catch (error) {
        console.error("Failed to load contact:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [id]);

  const handleSuccess = () => {
    router.push("/contacts");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center gap-4 px-8">
          <Link href="/contacts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Contact Details</h1>
        </div>
      </div>

      <div className="p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <ContactForm
              contact={contact}
              onSuccess={handleSuccess}
              saveAndCreate={false}
              onSaveAndCreateChange={() => {}}
            />
          </div>
          <div>
            <ContactActivityLog contactId={contact.id} />
          </div>
        </div>
      </div>
    </div>
  );
}