import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Clock } from 'lucide-react';
import { AnimationPlayer } from '@/components/ui/animation-player';
import mediaConfig from '@/data/mediaConfig.json';

const CreateTimelessMessage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowAnimation(true);
      
      // Navigate after animation completes
      setTimeout(() => {
        navigate('/dashboard/timeless-messages');
      }, 3000);
    }, 1500);
  };

  if (showAnimation && mediaConfig.animations.messageSubmitted) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-lg">
          <AnimationPlayer 
            config={mediaConfig.animations.messageSubmitted}
            onComplete={() => navigate('/dashboard/timeless-messages')}
          />
          <p className="text-center mt-4 text-lg font-medium">
            Your timeless message has been safely stored for the future
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/timeless-messages')}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create Timeless Message</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" placeholder="Who is this message for?" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter the subject of your message" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Write your timeless message here..."
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Delivery Options</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="deliveryType" defaultChecked className="form-radio" />
                  <span>Future Date</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="deliveryType" className="form-radio" />
                  <span>Life Event</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input 
                  id="deliveryDate" 
                  type="date" 
                  className="flex-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/timeless-messages')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-pulse" />
                    Sending to Future...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTimelessMessage;
