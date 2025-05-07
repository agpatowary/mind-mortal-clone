
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Clock, Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface WisdomResource {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  resource_type: string;
  tags: string[] | null;
  published_status: string | null;
  resource_url: string | null;
  file_path: string | null;
  created_at: string | null;
  views_count: number | null;
}

const WisdomExchangePage: React.FC = () => {
  const [resources, setResources] = useState<WisdomResource[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchResources();
    }
  }, [user]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wisdom_resources')
        .select('*')
        .eq('published_status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resources:', error);
      } else {
        setResources(data || []);
      }
    } catch (err) {
      console.error('Error in fetch operation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWisdom = () => {
    navigate('/dashboard/create', { state: { contentType: 'wisdom-exchange' } });
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
            <h1 className="text-3xl font-bold">Wisdom Exchange</h1>
            <p className="text-muted-foreground mt-2">
              Discover and share knowledge and wisdom
            </p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateWisdom}
          >
            <Plus className="h-4 w-4" />
            Share Wisdom
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search wisdom resources..." 
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer">All</Badge>
          <Badge variant="outline" className="cursor-pointer">Articles</Badge>
          <Badge variant="outline" className="cursor-pointer">Videos</Badge>
          <Badge variant="outline" className="cursor-pointer">Courses</Badge>
          <Badge variant="outline" className="cursor-pointer">Audio</Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.map(resource => (
            <motion.div key={resource.id} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-secondary/50">
                      {resource.resource_type}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="h-3 w-3" />
                      <span>
                        {resource.created_at 
                          ? new Date(resource.created_at).toLocaleDateString() 
                          : 'Unknown date'}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {resource.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 flex justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 p-0 h-auto">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 100)}
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 p-0 h-auto">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 20)}
                        </span>
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <span>{resource.views_count || Math.floor(Math.random() * 500)} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {resources.length === 0 && (
            <motion.div variants={itemVariants} className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No wisdom resources yet</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    Be the first to share your knowledge and wisdom with the community
                  </p>
                  <Button onClick={handleCreateWisdom}>
                    <Plus className="h-4 w-4 mr-2" /> Share Your Wisdom
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default WisdomExchangePage;
