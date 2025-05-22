
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import LegacyPostForm from '@/components/legacy-vault/LegacyPostForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CreateLegacyPost = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto pb-8"
    >
      <div className="mb-4">
        <Button 
          variant="ghost" 
          className="pl-0" 
          onClick={() => navigate('/dashboard/legacy-vault')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Legacy Vault
        </Button>
      </div>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2 mb-2">
            <Archive className="h-6 w-6 text-primary" />
            <CardTitle>Create Legacy Post</CardTitle>
          </div>
          <CardDescription>
            Preserve your stories, wisdom, and experiences for future generations.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <LegacyPostForm />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateLegacyPost;
