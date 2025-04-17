"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Deal, dealSchema } from "@/types";
import { dealService } from "@/services/dealService";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Info } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { usePipelineStages } from "@/hooks/usePipelineStages";
import { useContacts } from "@/hooks/useContacts";

interface DealFormProps {
  deal?: Deal;
  onSuccess: () => void;
}

// Status options for deals
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export function DealForm({ deal, onSuccess }: DealFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: customers, isLoading: isLoadingCustomers } = useContacts();
  const { data: pipelineStages, isLoading: isLoadingStages } = usePipelineStages();
  const { users, loading: loadingUsers } = useUsers();
    
  console.log("Pipeline Stages:", pipelineStages);
  // Filter users to only include sales reps and management
  const salesUsers = users?.filter(user => 
    user.role === 'sales-rep' || user.role === 'sales-mgr' || user.role === 'admin'
  ) || [];

  const form = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: deal || {
      title: "",
      value: 0,
      customerId: "",
      stageId: "",
      probability: 20,
      expectedCloseDate: new Date().toISOString().split('T')[0],
      notes: "",
      assignedTo: "",
      status: "active",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      lostReason: "",
      nextActionDate: "",
      nextActionDescription: "",
    },
  });

  // Watch the status field to conditionally show lost reason
  const watchStatus = form.watch("status");

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (deal) {
        await dealService.updateDeal(deal._id, values);
        toast({
          title: "Deal Updated",
          description: "The deal has been updated successfully.",
        });
      } else {
        await dealService.createDeal(values);
        toast({
          title: "Deal Created",
          description: "The new deal has been created successfully.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the deal. Please try again.",
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
          {/* Basic Information */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enterprise Software License" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Value *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10000"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="probability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Probability (%) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Likelihood of closing this deal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingCustomers ? "Loading..." : "Select a customer"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers?.data?.map((customer) => (
                            <SelectItem key={customer._id} value={customer._id}>
                              {customer.firstName} - {customer.lastName}  - {customer.company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Deal Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Details</h2>
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="stageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pipeline Stage *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingStages ? "Loading..." : "Select stage"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pipelineStages?.map((stage) => (
                              <SelectItem key={stage.id} value={stage.id}>
                                {stage.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Current stage in the sales pipeline
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedCloseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Close Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Anticipated closing date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Current status of the deal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchStatus === "lost" && (
                  <FormField
                    control={form.control}
                    name="lostReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lost Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Reason why the deal was lost..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingUsers ? "Loading..." : "Select sales representative"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {salesUsers?.map((rep) => (
                            <SelectItem key={rep._id} value={rep._id}>
                              {rep.firstName} {rep.lastName}  
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Next Action */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nextActionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Action Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nextActionDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Action</FormLabel>
                        <FormControl>
                          <Input placeholder="Follow up call" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Notes */}
            <div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any relevant notes about the deal..."
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

          {/* Form Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {deal ? "Update Deal" : "Create Deal"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}