
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WisdomExchangeForm from '@/components/content/WisdomExchangeForm';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateWisdomResource = () => {
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
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Create Wisdom Resource</CardTitle>
          </div>
          <CardDescription>
            Share your knowledge and connect with others seeking guidance.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <WisdomExchangeForm 
            onCancel={() => navigate('/dashboard/wisdom-exchange')} 
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateWisdomResource;
