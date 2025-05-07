import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import RichTextEditor from "../editor/RichTextEditor";

const emailSchema = z.string().email({ message: "Please enter a valid email address" });

const timelessSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
  deliveryType: z.enum(["date", "event"]),
  deliveryDate: z.date().optional(),
  deliveryEvent: z.string().optional(),
  recipientEmails: z.array(emailSchema),
});

type TimelessFormValues = z.infer<typeof timelessSchema>;

const TimelessMessagesForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("date");
  const [newEmail, setNewEmail] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<TimelessFormValues>({
    resolver: zodResolver(timelessSchema),
    defaultValues: {
      title: "",
      content: "<p>Write your timeless message here...</p>",
      deliveryType: "date",
      recipientEmails: [],
    },
  });

  const onSubmit = async (values: TimelessFormValues) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to create timeless messages.",
          variant: "destructive",
        });
        return;
      }

      if (values.deliveryType === "date" && !values.deliveryDate) {
        toast({
          title: "Delivery date required",
          description: "Please select a delivery date for your message.",
          variant: "destructive",
        });
        return;
      }

      if (values.deliveryType === "event" && !values.deliveryEvent) {
        toast({
          title: "Event description required",
          description: "Please describe the event that will trigger your message.",
          variant: "destructive",
        });
        return;
      }

      if (values.recipientEmails.length === 0) {
        toast({
          title: "Recipients required",
          description: "Please add at least one recipient email address.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for the database
      const timelessMessage = {
        title: values.title,
        content: { html: values.content },
        delivery_type: values.deliveryType,
        user_id: user.id,
        status: "draft",
        recipient_emails: values.recipientEmails,
      };

      // Add delivery-specific data
      if (values.deliveryType === "date" && values.deliveryDate) {
        Object.assign(timelessMessage, { delivery_date: values.deliveryDate.toISOString() });
      } else if (values.deliveryType === "event" && values.deliveryEvent) {
        Object.assign(timelessMessage, { delivery_event: values.deliveryEvent });
      }

      const { error } = await supabase
        .from("timeless_messages")
        .insert(timelessMessage);

      if (error) throw error;

      toast({
        title: "Timeless message created",
        description: "Your message has been scheduled successfully.",
      });

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error creating timeless message:", error);
      toast({
        title: "Error",
        description: "There was an error scheduling your message.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("deliveryType", value as any);
  };

  const addEmail = () => {
    if (!newEmail) return;
    
    try {
      // Validate the email
      emailSchema.parse(newEmail);
      
      // Get current emails and add the new one
      const currentEmails = form.getValues("recipientEmails") || [];
      
      // Check if email already exists
      if (currentEmails.includes(newEmail)) {
        toast({
          title: "Duplicate email",
          description: "This email address has already been added.",
          variant: "destructive",
        });
        return;
      }
      
      form.setValue("recipientEmails", [...currentEmails, newEmail]);
      setNewEmail("");
    } catch (error) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  const removeEmail = (email: string) => {
    const currentEmails = form.getValues("recipientEmails");
    form.setValue(
      "recipientEmails", 
      currentEmails.filter(e => e !== email)
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-6">Create Timeless Message</h2>
      
      <Tabs defaultValue="date" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="date">Deliver on Date</TabsTrigger>
          <TabsTrigger value="event">Deliver on Event</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <TabsContent value="date">
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Delivery Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="event">
              <FormField
                control={form.control}
                name="deliveryEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E.g., Graduation, Wedding anniversary, Retirement" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the future event when this message should be delivered.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <FormField
              control={form.control}
              name="recipientEmails"
              render={() => (
                <FormItem>
                  <FormLabel>Recipients</FormLabel>
                  <div className="space-y-4">
                    <div className="flex">
                      <Input 
                        placeholder="recipient@example.com" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="rounded-r-none"
                      />
                      <Button 
                        type="button" 
                        onClick={addEmail}
                        className="rounded-l-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {form.watch("recipientEmails")?.map((email) => (
                        <div 
                          key={email} 
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center"
                        >
                          <span className="mr-1">{email}</span>
                          <button 
                            type="button" 
                            onClick={() => removeEmail(email)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FormDescription>
                    Add email addresses of people who should receive this message.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Write your timeless message..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit">
                Schedule Message
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default TimelessMessagesForm;
