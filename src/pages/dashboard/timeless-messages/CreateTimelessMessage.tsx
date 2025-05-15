
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Import the actual content creation component
import ContentCreationContainer from '@/components/content/ContentCreationContainer';

const CreateTimelessMessage = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto pb-8"
    >
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-6 w-6 text-primary" />
            <CardTitle>Create Timeless Message</CardTitle>
          </div>
          <CardDescription>
            Leave messages for your loved ones to be delivered at a specific time or event.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ContentCreationContainer 
            initialTab="timeless-messages"
            routeInfo={{
              cancelRoute: '/dashboard/timeless-messages',
              successRoute: '/dashboard/timeless-messages'
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateTimelessMessage;
