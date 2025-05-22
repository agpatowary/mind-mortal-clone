
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ViewDetailsButton } from '@/components/dashboard/ViewDetailsButton';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, Users, Star, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MentorshipPage = () => {
  const { user, isMentor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    resources: true,
    mentors: true
  });

  // Fetch wisdom resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(prev => ({ ...prev, resources: true }));
        
        let query = supabase
          .from('wisdom_resources')
          .select('*, profiles!wisdom_resources_created_by_fkey(full_name, avatar_url)');
        
        // If user is not a mentor, only show resources from mentors they're connected with
        if (!isMentor()) {
          query = query.eq('is_public', true);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast({
          title: 'Error',
          description: 'Failed to load mentorship resources',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, resources: false }));
      }
    };
    
    fetchResources();
  }, [isMentor]);

  // Fetch available mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(prev => ({ ...prev, mentors: true }));
        
        const { data, error } = await supabase
          .from('mentor_verification_status')
          .select('*, profiles!inner(full_name, avatar_url, bio)')
          .eq('is_verified', true);
        
        if (error) throw error;
        
        setMentors(data || []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        toast({
          title: 'Error',
          description: 'Failed to load mentors',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, mentors: false }));
      }
    };
    
    fetchMentors();
  }, []);

  const handleCreateResource = () => {
    navigate('/dashboard/mentorship/create-resource');
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mentorship</h1>
        {isMentor() && (
          <Button onClick={handleCreateResource}>
            <Plus className="mr-2 h-4 w-4" />
            Create Resource
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="resources">My Resources</TabsTrigger>
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
        </TabsList>
        
        {/* Resources Tab */}
        <TabsContent value="resources">
          {loading.resources ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : resources.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {isMentor() 
                    ? "You haven't created any mentorship resources yet. Create your first resource to share your knowledge."
                    : "No mentorship resources are available yet. Connect with mentors to access their resources."}
                </p>
                {isMentor() && (
                  <Button onClick={handleCreateResource}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Resource
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="relative h-40 bg-muted">
                    {resource.resource_url && (
                      <img 
                        src={resource.resource_url} 
                        alt={resource.title}
                        className="object-cover w-full h-full"
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={resource.is_public ? "default" : "outline"}>
                        {resource.is_public ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                    </div>
                    <div className="flex items-center mt-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={resource.profiles?.avatar_url} />
                        <AvatarFallback>{resource.profiles?.full_name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{resource.profiles?.full_name}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge variant="outline">{resource.resource_type}</Badge>
                      </div>
                      <ViewDetailsButton 
                        href={`/dashboard/mentorship/resource/${resource.id}`} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Find Mentors Tab */}
        <TabsContent value="mentors">
          {loading.mentors ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : mentors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No mentors available</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  There are no verified mentors available at the moment. Check back later as new mentors join the platform.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <Card key={mentor.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={mentor.profiles?.avatar_url} />
                        <AvatarFallback>{mentor.profiles?.full_name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium text-lg">{mentor.profiles?.full_name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{mentor.wisdom_rating || 5}</span>
                        <span className="mx-2">•</span>
                        <span>{mentor.experience_years} years experience</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm text-center mb-4 line-clamp-3">
                      {mentor.profiles?.bio || "No bio available"}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {mentor.expertise?.slice(0, 3).map((exp: string, i: number) => (
                        <Badge key={i} variant="secondary" className="font-normal">{exp}</Badge>
                      ))}
                      {(mentor.expertise?.length || 0) > 3 && (
                        <Badge variant="outline">+{(mentor.expertise?.length || 0) - 3} more</Badge>
                      )}
                    </div>
                    
                    <Button className="w-full" onClick={() => navigate(`/dashboard/mentorship/mentor/${mentor.id}`)}>
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorshipPage;
