
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Archive, MessageSquare, Users } from 'lucide-react';

type ContentType = 'legacy' | 'wisdom' | 'timeless' | null;

const CreateContentPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ContentType>(null);

  const contentTypes = [
    {
      type: 'legacy' as const,
      title: 'Legacy Vault',
      description: 'Create content for your personal legacy that can be shared with future generations.',
      icon: Archive,
      color: 'text-amber-500'
    },
    {
      type: 'wisdom' as const,
      title: 'Wisdom Exchange',
      description: 'Share your knowledge and insights with others seeking guidance.',
      icon: Users,
      color: 'text-primary'
    },
    {
      type: 'timeless' as const,
      title: 'Timeless Messages',
      description: 'Create messages to be delivered at a specific time in the future.',
      icon: MessageSquare,
      color: 'text-green-500'
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
        <h1 className="text-3xl font-bold">Create New Content</h1>
        <p className="text-muted-foreground mt-2">
          Select the type of content you'd like to create
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        {contentTypes.map((content) => (
          <motion.div key={content.type} variants={itemVariants}>
            <Card 
              className={`cursor-pointer transition-all ${
                selectedType === content.type 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedType(content.type)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <content.icon className={`h-5 w-5 ${content.color}`} />
                  {content.title}
                </CardTitle>
                <CardDescription>{content.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  variant={selectedType === content.type ? "default" : "outline"}
                  onClick={() => setSelectedType(content.type)}
                >
                  {selectedType === content.type ? 'Selected' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedType && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Create {selectedType === 'legacy' 
                  ? 'Legacy Vault Post' 
                  : selectedType === 'wisdom' 
                    ? 'Wisdom Exchange Post' 
                    : 'Timeless Message'}
              </CardTitle>
              <CardDescription>
                Fill in the details to create your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Content creation form will be implemented here based on the selected type.
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={() => setSelectedType(null)}>
                  Cancel
                </Button>
                <Button>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CreateContentPage;
