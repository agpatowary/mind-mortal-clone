import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Book, Clock, User, Edit, Filter, Eye, ThumbsUp, MessageSquare, FileText, Video, Headphones, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PostInteractions from '@/components/social/PostInteractions';
import BecomeAMentorForm from '@/components/mentor/BecomeAMentorForm';
import DashboardAnimatedBackground from '@/components/dashboard/DashboardAnimatedBackground';
import ViewDetailsButton from '@/components/dashboard/ViewDetailsButton';
import { renderContent, truncateContent } from '@/utils/contentRenderers';

const WisdomExchangePage = () => {
  const { user, profile, roles, isLoading } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<any[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [activeTab, setActiveTab] = useState("explore");

  // Function to check if user is a mentor
  const isMentor = () => roles.includes('mentor');

  useEffect(() => {
    fetchResources();
  }, [user?.id]);

  const fetchResources = async () => {
    if (!user) {
      console.log("No user found, skipping resource fetch");
      setIsLoadingResources(false);
      return;
    }

    try {
      setIsLoadingResources(true);
      console.log("Fetching wisdom resources for user:", user.id);
      
      // First, get the wisdom resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('wisdom_resources')
        .select(`
          id,
          title,
          description,
          resource_type,
          resource_url,
          tags,
          created_at,
          views_count,
          created_by,
          published_status
        `)
        .eq('published_status', 'published')
        .limit(10);
        
      if (resourcesError) {
        console.error('Error fetching wisdom resources:', resourcesError);
        throw resourcesError;
      }
      
      console.log("Resources fetched:", resourcesData);
      
      if (!resourcesData || resourcesData.length === 0) {
        setResources([]);
        setIsLoadingResources(false);
        return;
      }

      // For each resource, fetch additional data
      const resourcesWithDetails = await Promise.all(
        resourcesData.map(async (resource) => {
          // Get creator profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', resource.created_by)
            .single();
            
          if (profileError) {
            console.warn('Error fetching profile for resource creator:', profileError);
          }
          
          // Get likes count
          const { count: likesCount, error: likesError } = await supabase
            .from('post_likes')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', resource.id)
            .eq('post_type', 'wisdom_resources');
            
          if (likesError) {
            console.warn('Error fetching likes count:', likesError);
          }
          
          // Check if user liked the post
          const { data: userLikeData, error: userLikeError } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', resource.id)
            .eq('post_type', 'wisdom_resources')
            .eq('user_id', user.id);
            
          if (userLikeError) {
            console.warn('Error checking if user liked post:', userLikeError);
          }
          
          // Get comments count
          const { count: commentsCount, error: commentsError } = await supabase
            .from('post_comments')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', resource.id)
            .eq('post_type', 'wisdom_resources');
            
          if (commentsError) {
            console.warn('Error fetching comments count:', commentsError);
          }
          
          return {
            ...resource,
            profiles: {
              full_name: profileData?.full_name || 'Anonymous',
              avatar_url: profileData?.avatar_url
            },
            likes_count: { count: likesCount || 0 },
            comments_count: { count: commentsCount || 0 },
            user_liked: userLikeData && userLikeData.length > 0
          };
        })
      );
      
      console.log("Resources with details:", resourcesWithDetails);
      setResources(resourcesWithDetails);
    } catch (error) {
      console.error('Error in fetchResources function:', error);
      toast({
        title: "Error fetching resources",
        description: "There was a problem loading the wisdom resources.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingResources(false);
    }
  };

  // Animation variants for staggered child animations
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
        damping: 12
      }
    }
  };

  // Resource type icons mapping
  const resourceTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Headphones className="h-5 w-5" />;
      default:
        return <Book className="h-5 w-5" />;
    }
  };

  return (
    <DashboardAnimatedBackground objectCount={8}>
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold">Wisdom Exchange</h1>
              <p className="text-muted-foreground mt-1">
                Discover and share knowledge with the community
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isMentor() ? (
                <Button className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Share Wisdom</span>
                </Button>
              ) : (
                <BecomeAMentorForm />
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
                <TabsTrigger value="explore">Explore</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
              
              <div className="flex justify-between items-center my-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    <span>All Resources</span>
                  </Badge>
                </div>
              </div>
              
              <TabsContent value="explore" className="space-y-6">
                {isLoadingResources ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Card key={i} className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
                        <CardHeader className="pb-2">
                          <div className="w-2/3 h-6 bg-muted rounded animate-pulse mb-2"></div>
                          <div className="w-full h-4 bg-muted/50 rounded animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full h-20 bg-muted/30 rounded animate-pulse"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource, index) => (
                      <motion.div 
                        key={resource.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="h-full flex flex-col overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <Badge className="mb-2" variant="outline">
                                <div className="flex items-center gap-1">
                                  {resourceTypeIcon(resource.resource_type)}
                                  <span className="capitalize">{resource.resource_type}</span>
                                </div>
                              </Badge>
                              
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Eye className="h-4 w-4" />
                                <span>{resource.views_count || 0}</span>
                              </div>
                            </div>
                            <CardTitle className="text-xl line-clamp-1">{resource.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={resource.profiles?.avatar_url} />
                                <AvatarFallback>
                                  <User className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{resource.profiles?.full_name || 'Anonymous'}</span>
                              <span className="text-muted-foreground text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(resource.created_at).toLocaleDateString()}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="flex-1">
                            <div className="text-sm">
                              {truncateContent(resource.description || '', 120)}
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-3">
                              {resource.tags && resource.tags.map((tag: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          
                          <CardFooter className="border-t pt-4 flex flex-col items-stretch">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex space-x-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{resource.likes_count?.count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{resource.comments_count?.count || 0}</span>
                                </div>
                              </div>
                              
                              <ViewDetailsButton 
                                route={`/dashboard/wisdom/${resource.id}`}
                                text="Read More"
                              />
                            </div>
                            
                            <PostInteractions 
                              postId={resource.id}
                              postType="wisdom_resources"
                              initialLikesCount={resource.likes_count?.count || 0}
                              initialCommentsCount={resource.comments_count?.count || 0}
                              userLiked={!!resource.user_liked}
                              onUpdate={fetchResources}
                            />
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Book className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No wisdom resources found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {isMentor() 
                        ? "Share your knowledge by creating the first wisdom resource!"
                        : "There are no wisdom resources available yet. Follow mentors to see their content here."}
                    </p>
                    
                    {isMentor() ? (
                      <Button className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Create Resource</span>
                      </Button>
                    ) : (
                      <BecomeAMentorForm />
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="following">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Follow mentors to see their content</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    When you follow mentors, their wisdom resources will appear here.
                  </p>
                  
                  <Button className="flex items-center gap-2" onClick={() => setActiveTab("explore")}>
                    <User className="h-4 w-4" />
                    <span>Find Mentors</span>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="saved">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Book className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No saved resources yet</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Resources you save will appear here for easier access.
                  </p>
                  
                  <Button className="flex items-center gap-2" onClick={() => setActiveTab("explore")}>
                    <Book className="h-4 w-4" />
                    <span>Explore Resources</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </DashboardAnimatedBackground>
  );
};

export default WisdomExchangePage;
