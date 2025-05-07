
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Mail, Eye, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder data
const mockMessages = [
  {
    id: '1',
    title: 'To My Future Children',
    recipients: ['Future Children'],
    status: 'scheduled',
    deliveryType: 'event',
    deliveryEvent: 'Birth of Child',
    createdAt: new Date('2023-04-18'),
    hasAttachments: true,
    content: 'This is a letter I want you to read when you are old enough to understand...'
  },
  {
    id: '2',
    title: 'Reflections on My 40th Birthday',
    recipients: ['Myself'],
    status: 'scheduled',
    deliveryType: 'date',
    deliveryDate: new Date('2028-10-15'),
    createdAt: new Date('2023-05-22'),
    hasAttachments: false,
    content: 'Dear future self, I hope that by the time you read this...'
  },
  {
    id: '3',
    title: 'Wedding Anniversary Surprise',
    recipients: ['My Spouse'],
    status: 'draft',
    deliveryType: 'date',
    deliveryDate: new Date('2025-06-12'),
    createdAt: new Date('2023-06-01'),
    hasAttachments: true,
    content: 'I wanted to create this surprise for our future anniversary...'
  }
];

const TimelessMessages: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const getFilteredMessages = () => {
    return mockMessages.filter(message => {
      if (activeTab === 'drafts') return message.status === 'draft';
      if (activeTab === 'scheduled') return message.status === 'scheduled';
      return true; // 'all' tab
    });
  };
  
  const filteredMessages = getFilteredMessages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Timeless Messages</h1>
        <p className="text-muted-foreground">
          Create private messages to be delivered at a future date or after specific events.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button asChild>
          <Link to="/dashboard/create?type=timeless">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Message
          </Link>
        </Button>
      </div>

      <TabsContent value={activeTab} className="mt-0">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No messages found.</p>
            <Button asChild>
              <Link to="/dashboard/create?type=timeless">Create Your First Message</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMessages.map(message => (
              <Card key={message.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{message.title}</CardTitle>
                    <Badge variant={message.status === 'draft' ? "outline" : "default"}>
                      {message.status === 'draft' ? 'Draft' : 'Scheduled'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Created on {message.createdAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Recipients:</div>
                    <div className="flex flex-wrap gap-1">
                      {message.recipients.map(recipient => (
                        <Badge key={recipient} variant="secondary" className="text-xs">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    {message.deliveryType === 'date' ? (
                      <>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          Delivers on {message.deliveryDate?.toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          Delivers after: {message.deliveryEvent}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {message.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {message.status === 'draft' && (
                    <Button size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </div>
  );
};

export default TimelessMessages;
