import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast";
import { MediaItem, RecurringMessageSettings } from '@/types';
import FileUploader from '../FileUpload';
import { AnimationPlayer } from "../ui/animation-player";
import mediaConfig from '@/data/mediaConfig.json';
import { Dialog, DialogContent } from "../ui/dialog";

interface TimelessMessagesFormProps {
  onComplete?: (message: any) => void;
}

const TimelessMessagesForm = ({
  onComplete
}: TimelessMessagesFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [recurringSettings, setRecurringSettings] = useState<RecurringMessageSettings>({
    isRecurring: false
  });
  const { toast } = useToast();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const handleMediaUpload = (newMedia: MediaItem) => {
    setMediaUrls(prevUrls => [...prevUrls, newMedia.url]);
  };

  const handleRemoveMedia = (urlToRemove: string) => {
    setMediaUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
  };

  const handleRecurringChange = (field: keyof RecurringMessageSettings, value: any) => {
    setRecurringSettings(prevSettings => ({
      ...prevSettings,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate inputs
      if (!title.trim() || !content.trim() || !recipient.trim()) {
        toast({
          title: "Invalid input",
          description: "Please fill out all required fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create message object
      const timelessMessage = {
        id: uuidv4(),
        title: title.trim(),
        content: content.trim(),
        recipient: recipient.trim(),
        delivery_date: deliveryDate ? new Date(deliveryDate).toISOString() : null,
        recurring: recurringSettings,
        created_at: new Date().toISOString(),
        content_type: mediaType,
        attachments: mediaUrls,
      };
      
      // Here you would send the data to your backend
      console.log("Submitting message:", timelessMessage);
      
      // Show the success animation
      setShowSuccessAnimation(true);
      
      // Reset form after animation completes
      setTimeout(() => {
        setTitle("");
        setContent("");
        setRecipient("");
        setDeliveryDate("");
        setMediaType(null);
        setMediaUrls([]);
        setRecurringSettings({
          isRecurring: false
        });
        setShowSuccessAnimation(false);
        
        toast({
          title: "Message created!",
          description: "Your timeless message has been scheduled.",
        });
        
        if (onComplete) {
          onComplete(timelessMessage);
        }
        
        setIsSubmitting(false);
      }, 3000); // Allow time for animation to play
    } catch (error) {
      console.error("Error submitting message:", error);
      toast({
        title: "Submission failed",
        description: "There was an error creating your message.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Message Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Your Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="recipient">Recipient</Label>
          <Input
            type="text"
            id="recipient"
            placeholder="Recipient's Name"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label>Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !deliveryDate && "text-muted-foreground"
                )}
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deliveryDate}
                onSelect={setDeliveryDate}
                disabled={isSubmitting}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label>Media Type</Label>
          <Select onValueChange={setMediaType} disabled={isSubmitting}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Document</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {mediaType && (
          <div>
            <Label>Upload Media</Label>
            <FileUploader
              mediaType={mediaType}
              onMediaUploaded={handleMediaUpload}
            />
          </div>
        )}
        
        {mediaUrls.length > 0 && (
          <div>
            <Label>Uploaded Media</Label>
            <div className="flex flex-wrap gap-2">
              {mediaUrls.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="Uploaded Media" className="w-32 h-32 object-cover rounded-md" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 bg-background/50 text-muted-foreground hover:text-red-500"
                    onClick={() => handleRemoveMedia(url)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Accordion type="single" collapsible>
          <AccordionItem value="recurring">
            <AccordionTrigger>Recurring Message</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRecurring"
                    checked={recurringSettings.isRecurring}
                    onCheckedChange={(checked) => handleRecurringChange('isRecurring', checked)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="isRecurring">Enable Recurring Message</Label>
                </div>
                
                {recurringSettings.isRecurring && (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select onValueChange={(value) => handleRecurringChange('frequency', value)} disabled={isSubmitting}>
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Select a frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Message"}
        </Button>
        
        {/* Success Animation Dialog */}
        <Dialog open={showSuccessAnimation} onOpenChange={setShowSuccessAnimation}>
          <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
            <div className="w-full h-64">
              <AnimationPlayer 
                config={{
                  path: mediaConfig.animations.messageSubmitted.path,
                  fallbackImage: mediaConfig.animations.messageSubmitted.fallbackImage
                }}
                onComplete={() => setShowSuccessAnimation(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default TimelessMessagesForm;
