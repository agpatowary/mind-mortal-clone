
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Plus, Calendar, MailOpen } from 'lucide-react';

const TimelessMessagesPage: React.FC = () => {
  // Mock data for timeless messages
  const messages = [
    {
      id: 1,
      title: "For My Daughter's 18th Birthday",
      recipient: "Emma",
      content: "My dearest Emma, as you reach this milestone in your life...",
      createdDate: "2023-10-15",
      deliveryDate: "2030-06-12",
      status: "scheduled"
    },
    {
      id: 2,
      title: "Advice for My Future Grandchildren",
      recipient: "Future Grandchildren",
      content: "To my grandchildren, whom I may not have the chance to meet...",
      createdDate: "2023-11-05",
      deliveryDate: "2040-01-01",
      status: "scheduled"
    },
    {
      id: 3,
      title: "Anniversary Wishes",
      recipient: "Sarah",
      content: "My beloved wife, on our 30th anniversary I want you to know...",
      createdDate: "2023-09-20",
      deliveryDate: "2025-09-20",
      status: "scheduled"
    },
    {
      id: 4,
      title: "Graduation Congratulations",
      recipient: "James",
      content: "Congratulations on your graduation! I always knew you could do it...",
      createdDate: "2022-05-10",
      deliveryDate: "2023-06-15",
      status: "delivered"
    }
  ];

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
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="scheduled" className="mb-8">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
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
                      To: {message.recipient} • Created: {new Date(message.createdDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/50 p-4 rounded-md flex items-center gap-3 mb-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">DELIVERY DATE</p>
                        <p className="font-medium">{new Date(message.deliveryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="line-clamp-3">{message.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.round((new Date(message.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Message
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="delivered">
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
                      To: {message.recipient} • Created: {new Date(message.createdDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-500/10 p-4 rounded-md flex items-center gap-3 mb-4 border border-green-500/20">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">DELIVERED ON</p>
                        <p className="font-medium">{new Date(message.deliveryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="line-clamp-3">{message.content}</p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimelessMessagesPage;
