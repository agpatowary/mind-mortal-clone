
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Search, Tag, Clock, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GroupCircles from '@/components/wisdom-exchange/GroupCircles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PostInteractions from '@/components/social/PostInteractions';

const WisdomExchangePage = () => {
  const navigate = useNavigate();
  const { user, isMentor } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, [user]);

  // Filter resources when search query or filter changes
  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, typeFilter]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('wisdom_resources')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (resource.tags && resource.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(resource => resource.resource_type === typeFilter);
    }
    
    setFilteredResources(filtered);
  };

  const handleCreateResource = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create wisdom resources',
        variant: 'destructive',
      });
      return;
    }
    
    if (!isMentor()) {
      toast({
        title: 'Mentor access required',
        description: 'Only mentors can create wisdom resources',
        variant: 'destructive',
      });
      return;
    }
    
    navigate('/dashboard/wisdom-exchange/create');
  };

  const handleResourceLike = async (resourceId: string) => {
    try {
      // Refresh the resources after a like action
      await fetchResources();
    } catch (error) {
      console.error('Error updating resource likes:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Wisdom Exchange</h1>
        {isMentor() && (
          <Button onClick={handleCreateResource}>
            <Plus className="mr-2 h-4 w-4" />
            Create Resource
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="feed">Wisdom Feed</TabsTrigger>
          <TabsTrigger value="circles">Group Circles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed">
          <Card>
            <CardHeader>
              <CardTitle>Wisdom Resources</CardTitle>
              <CardDescription>Browse wisdom resources shared by mentors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="podcast">Podcasts</SelectItem>
                    <SelectItem value="book">Books</SelectItem>
                    <SelectItem value="course">Courses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="space-y-6">
                  {filteredResources.map((resource) => (
                    <Card key={resource.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={resource.profiles?.avatar_url} />
                            <AvatarFallback>{resource.profiles?.full_name?.charAt(0) || 'M'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{resource.profiles?.full_name || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(resource.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                        
                        {resource.description && (
                          <p className="text-muted-foreground mb-4">{resource.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {resource.resource_type}
                          </Badge>
                          
                          {resource.boost_count > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              Boosted
                            </Badge>
                          )}
                          
                          {resource.tags && resource.tags.map((tag: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <PostInteractions 
                            postId={resource.id} 
                            postType="wisdom_resource"
                            onUpdate={() => handleResourceLike(resource.id)}
                          />
                          
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            View Resource
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No resources found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || typeFilter 
                      ? "Try adjusting your search filters"
                      : "No wisdom resources have been shared yet"}
                  </p>
                  {isMentor() && (
                    <Button onClick={handleCreateResource}>
                      <Plus className="mr-2 h-4 w-4" />
                      Share Wisdom Resource
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="circles">
          <GroupCircles />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WisdomExchangePage;
