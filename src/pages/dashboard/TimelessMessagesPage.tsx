
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Clock, Calendar, Plus, User, Send, Inbox, Archive, Edit, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import DashboardAnimatedBackground from '@/components/dashboard/DashboardAnimatedBackground';
import PostInteractions from '@/components/social/PostInteractions';

const TimelessMessagesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('timeless_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMessage = () => {
    // Updated to directly navigate to the correct path
    navigate('/dashboard/timeless-messages/create');
  };

  return (
    <DashboardAnimatedBackground objectCount={6}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Timeless Messages</h1>
            <p className="text-muted-foreground">
              Messages sent across time to your future loved ones
            </p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateMessage}
          >
            <Plus className="h-4 w-4" />
            Create Message
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-xl">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 mt-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
                  <CardHeader className="pb-2">
                    <div className="w-1/3 h-6 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="w-2/3 h-4 bg-muted/50 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-16 bg-muted/30 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-6">
                {messages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MessageCard message={message} onUpdate={fetchMessages} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Mail className="h-16 w-16 text-muted-foreground" />}
                    title="No messages yet"
                    description="Create your first timeless message to be delivered in the future."
                    action={handleCreateMessage}
                  />
                )}
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-6">
                {messages.filter(m => m.status === 'scheduled').length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {messages
                      .filter(m => m.status === 'scheduled')
                      .map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MessageCard message={message} onUpdate={fetchMessages} />
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Calendar className="h-16 w-16 text-muted-foreground" />}
                    title="No scheduled messages"
                    description="Schedule a message to be delivered at a future date."
                    action={handleCreateMessage}
                  />
                )}
              </TabsContent>

              <TabsContent value="delivered" className="space-y-6">
                {messages.filter(m => m.status === 'delivered').length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {messages
                      .filter(m => m.status === 'delivered')
                      .map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MessageCard message={message} onUpdate={fetchMessages} />
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Send className="h-16 w-16 text-muted-foreground" />}
                    title="No delivered messages"
                    description="Messages that have been delivered will appear here."
                    action={handleCreateMessage}
                  />
                )}
              </TabsContent>

              <TabsContent value="drafts" className="space-y-6">
                {messages.filter(m => m.status === 'draft').length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {messages
                      .filter(m => m.status === 'draft')
                      .map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MessageCard message={message} onUpdate={fetchMessages} />
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Archive className="h-16 w-16 text-muted-foreground" />}
                    title="No draft messages"
                    description="Save messages as drafts to edit them later."
                    action={handleCreateMessage}
                  />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardAnimatedBackground>
  );
};

const MessageCard = ({ message, onUpdate }: { message: any, onUpdate: () => Promise<void> }) => {
  const navigate = useNavigate();
  
  const handleEditMessage = () => {
    // Navigate to edit page
    navigate(`/dashboard/timeless-messages/edit/${message.id}`);
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'delivered':
        return <Badge variant="default">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const renderDeliveryInfo = (message: any) => {
    if (message.status === 'draft') {
      return <span className="text-muted-foreground">Not scheduled yet</span>;
    }
    
    if (message.delivery_date) {
      return (
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(message.delivery_date).toLocaleDateString()}
          </span>
        </span>
      );
    }
    
    return <span className="text-muted-foreground">Delivery not set</span>;
  };
  
  const renderRecipients = (recipients: any) => {
    if (!recipients || recipients.length === 0) {
      return <span className="text-muted-foreground">No recipients</span>;
    }
    
    return (
      <div className="flex -space-x-2">
        {recipients.slice(0, 3).map((recipient: any, index: number) => (
          <Avatar key={index} className="h-6 w-6 border-2 border-background">
            <AvatarFallback className="text-xs">
              {recipient.name ? recipient.name.charAt(0) : <User className="h-3 w-3" />}
            </AvatarFallback>
          </Avatar>
        ))}
        {recipients.length > 3 && (
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
            +{recipients.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{message.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>Created {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
              {renderStatusBadge(message.status)}
            </CardDescription>
          </div>
          {message.is_recurring && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Recurring</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-sm">
          {message.content && (
            <p className="line-clamp-2">
              {typeof message.content === 'object' ? 
                (message.content.text || 'No message content') : 
                message.content}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <h4 className="text-sm font-medium mb-1">Delivery</h4>
            {renderDeliveryInfo(message)}
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Recipients</h4>
            {renderRecipients(message.recipients)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <PostInteractions 
          postId={message.id} 
          postType="timeless_message"
          onUpdate={onUpdate}
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEditMessage}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  action: () => void 
}) => {
  return (
    <Card className="text-center py-12">
      <CardContent className="flex flex-col items-center justify-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
        <Button onClick={action} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimelessMessagesPage;
