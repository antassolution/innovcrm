"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Contact } from "@/types";
import { contactService } from "@/services/contactService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Info } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  companyId: z.string().optional(),
  category: z.enum(["lead", "prospect", "customer", "partner"]),
  note: z.string().optional(),
});

interface ContactFormProps {
  contact?: Contact;
  onSuccess: () => void;
  saveAndCreate: boolean;
  onSaveAndCreateChange: (value: boolean) => void;
}

export function ContactForm({
  contact,
  onSuccess,
  saveAndCreate,
  onSaveAndCreateChange,
}: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact
      ? {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          mobile: contact.mobile || "",
          jobTitle: contact.position,
          department: contact.department || "",
          companyId: contact.companyId,
          category: contact.category,
          note: contact.note,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          mobile: "",
          jobTitle: "",
          department: "",
          companyId: "",
          category: "lead",
          note: "",
        },
  });


  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      setLoading(true);

      if (
        !contact ||
        (contact &&
          (contact.email !== values.email || contact.phone !== values.phone))
      ) {
        const isDuplicate = await contactService.checkDuplicate(
          values.email,
          values.phone || ""
        );
        console.log("isDuplicate--", isDuplicate);
        if (isDuplicate) {
          console.log("toast", isDuplicate);

          toast({
            title: "Duplicate Contact",
            description:
              "A contact with this email or phone number already exists.",
            variant: "destructive",
          });
          return;
        }
      }

      const contactData = {
        ...values,
        name: `${values.firstName} ${values.lastName}`,
        position: values.jobTitle,
      };

      if (contact) {
        await contactService.updateContact(contact._id, contactData);
        toast({
          title: "Contact Updated",
          description: "The contact has been updated successfully.",
        });
      } else {
        await contactService.createContact(contactData);
        toast({
          title: "Contact Created",
          description: "The new contact has been created successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
              </div>
            </div>



            <div className="border-t border-gray-200" />

            {/* Additional Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any relevant note about the contact..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {!contact && (
                  <>
                    <Checkbox
                      id="saveAndCreate"
                      checked={saveAndCreate}
                      onCheckedChange={onSaveAndCreateChange}
                    />
                    <label
                      htmlFor="saveAndCreate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Save and create another
                    </label>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onSuccess()}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[120px] px-4"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {contact ? "Update Contact" : "Create Contact"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
