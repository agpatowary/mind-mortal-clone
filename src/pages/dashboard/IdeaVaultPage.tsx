
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Plus, Search, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import PostInteractions from '@/components/social/PostInteractions';
import PostDetailsModal from '@/components/modals/PostDetailsModal';
import DashboardAnimatedBackground from '@/components/dashboard/DashboardAnimatedBackground';

const IdeaVaultPage: React.FC = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchIdeas();
    }
  }, [user]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('idea_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ideas:', error);
      } else {
        setIdeas(data || []);
      }
    } catch (err) {
      console.error('Error in fetch operation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = () => {
    navigate('/dashboard/idea-vault/create');
  };

  const handleViewDetails = (idea: any) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <DashboardAnimatedBackground objectCount={8}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Lightbulb className="h-8 w-8 text-primary" />
                Idea Vault
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover, share, and develop innovative ideas
              </p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={handleCreateIdea}
            >
              <Plus className="h-4 w-4" />
              Create Idea
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search ideas by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

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
            {filteredIdeas.map(idea => (
              <motion.div 
                key={idea.id} 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        {idea.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {idea.is_public ? (
                          <Eye className="h-4 w-4 text-green-500" title="Public" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" title="Private" />
                        )}
                        {idea.is_featured && (
                          <TrendingUp className="h-4 w-4 text-orange-500" title="Featured" />
                        )}
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {new Date(idea.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    {idea.description && (
                      <p className="text-sm mb-4 line-clamp-3">{idea.description}</p>
                    )}
                    
                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {idea.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {idea.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{idea.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col items-stretch">
                    <PostInteractions 
                      postId={idea.id} 
                      postType="idea_post"
                      onUpdate={fetchIdeas}
                    />
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(idea)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {filteredIdeas.length === 0 && !loading && (
              <motion.div variants={itemVariants} className="col-span-full">
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Lightbulb className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-medium mb-2">
                      {searchTerm ? 'No ideas found' : 'No ideas yet'}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">
                      {searchTerm 
                        ? 'Try adjusting your search terms to find what you\'re looking for.'
                        : 'Share your first innovative idea with the community and get feedback from other creators.'
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={handleCreateIdea}>
                        <Plus className="h-4 w-4 mr-2" /> Create Your First Idea
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        <PostDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={selectedIdea}
          postType="idea_post"
          onUpdate={fetchIdeas}
        />
      </div>
    </DashboardAnimatedBackground>
  );
};

export default IdeaVaultPage;
