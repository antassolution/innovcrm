import { ContactDetails } from "@/components/contacts/ContactDetails";

export default function ContactDetailsPage({ params }: { params: { id: string } }) {
  return <ContactDetails id={params.id} />;
}