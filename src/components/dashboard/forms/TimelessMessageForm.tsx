
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

// Define form schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  recipient: z.string().min(2, {
    message: "Recipient must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  deliveryType: z.enum(['date', 'event']),
  deliveryDate: z.string().optional(),
  deliveryEvent: z.string().optional(),
});

const TimelessMessageForm: React.FC = () => {
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      recipient: '',
      content: '',
      deliveryType: 'date',
    },
  });

  const deliveryType = form.watch('deliveryType');

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would normally handle the API call to save the message
    console.log(values);
    
    toast({
      title: "Success!",
      description: "Your timeless message has been created.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your message" {...field} />
              </FormControl>
              <FormDescription>
                A title to identify this message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input placeholder="Who is this message for? (e.g., My Children, Future Self)" {...field} />
              </FormControl>
              <FormDescription>
                Specify who should receive this message.
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your message here..." 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This is the content of your message that will be delivered.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Delivery Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="date" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Deliver on a specific date
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="event" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Deliver after a specific event
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {deliveryType === 'date' && (
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  When should this message be delivered?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {deliveryType === 'event' && (
          <FormField
            control={form.control}
            name="deliveryEvent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Event</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="birth">Birth of a Child</SelectItem>
                    <SelectItem value="passing">After My Passing</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  After what event should this message be delivered?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button">Save as Draft</Button>
          <Button type="submit">Create Message</Button>
        </div>
      </form>
    </Form>
  );
};

export default TimelessMessageForm;
