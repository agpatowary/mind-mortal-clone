
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Plus, Calendar, MailOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const TimelessMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timeless_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Error in fetch operation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = () => {
    navigate('/dashboard/create', { state: { contentType: 'timeless-message' } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Timeless Messages</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage messages for future delivery
            </p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={handleNewMessage}
          >
            <Plus className="h-4 w-4" />
            Create Message
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="scheduled" className="mb-8">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {messages.filter(msg => msg.status === "scheduled").map(message => (
                <motion.div key={message.id} variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        {message.title}
                      </CardTitle>
                      <CardDescription>
                        {message.recipients && message.recipients.length > 0 
                          ? `To: ${message.recipients[0]?.name || 'Recipient'} • ` 
                          : ''}
                        Created: {new Date(message.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-secondary/50 p-4 rounded-md flex items-center gap-3 mb-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">DELIVERY DATE</p>
                          <p className="font-medium">
                            {message.delivery_date 
                              ? new Date(message.delivery_date).toLocaleDateString() 
                              : message.delivery_event || 'Not scheduled'}
                          </p>
                        </div>
                      </div>
                      <p className="line-clamp-3">
                        {typeof message.content === 'string' 
                          ? message.content
                          : message.content?.text || 'No content provided'}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {message.delivery_date 
                            ? Math.round((new Date(message.delivery_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + ' days remaining'
                            : 'Event-based delivery'}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Message
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}

              {messages.filter(msg => msg.status === "scheduled").length === 0 && (
                <motion.div variants={itemVariants} className="col-span-2">
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-2">No scheduled messages yet</h3>
                      <p className="text-muted-foreground mb-6 text-center max-w-md">
                        Create a new message to schedule it for future delivery
                      </p>
                      <Button onClick={handleNewMessage}>
                        <Plus className="h-4 w-4 mr-2" /> Create Your First Message
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="delivered">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {messages.filter(msg => msg.status === "delivered").map(message => (
                <motion.div key={message.id} variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MailOpen className="h-5 w-5 text-green-500" />
                        {message.title}
                      </CardTitle>
                      <CardDescription>
                        {message.recipients && message.recipients.length > 0 
                          ? `To: ${message.recipients[0]?.name || 'Recipient'} • ` 
                          : ''}
                        Created: {new Date(message.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-green-500/10 p-4 rounded-md flex items-center gap-3 mb-4 border border-green-500/20">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">DELIVERED ON</p>
                          <p className="font-medium">
                            {message.delivery_date 
                              ? new Date(message.delivery_date).toLocaleDateString() 
                              : 'Event triggered'}
                          </p>
                        </div>
                      </div>
                      <p className="line-clamp-3">
                        {typeof message.content === 'string' 
                          ? message.content
                          : message.content?.text || 'No content provided'}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View Full Message
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}

              {messages.filter(msg => msg.status === "delivered").length === 0 && (
                <motion.div variants={itemVariants} className="col-span-2">
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MailOpen className="h-12 w-12 mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-2">No messages delivered yet</h3>
                      <p className="text-muted-foreground mb-6 text-center max-w-md">
                        Your scheduled messages will appear here after they've been delivered
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimelessMessagesPage;
