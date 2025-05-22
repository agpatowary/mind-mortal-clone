
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, BookOpen, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const MentorshipPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
      fetchResources();
      fetchMentors();
    }
  }, [user]);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);

      if (error) throw error;

      if (data) {
        setUserRoles(data.map(r => r.role));
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      
      // If user is a mentor, fetch their own resources
      // If user is a mentee, fetch resources from mentors they're connected with
      let query = supabase
        .from('wisdom_resources')
        .select(`
          id,
          title,
          description,
          resource_type,
          created_at,
          created_by,
          profiles(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      // Add conditions based on user role
      if (!userRoles.includes('mentor') && !userRoles.includes('admin')) {
        // For mentees, only show resources from their mentors
        query = query
          .in('created_by', function(subquery) {
            subquery
              .from('mentor_mentee_matches')
              .select('mentor_id')
              .eq('mentee_id', user?.id)
              .eq('status', 'accepted');
          })
          .eq('is_public', true);
      } else {
        // Mentors see their own resources
        query = query.eq('created_by', user?.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resources. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select(`
          id,
          expertise,
          industries,
          experience_years,
          wisdom_rating,
          profiles(id, full_name, avatar_url)
        `)
        .eq('id', function(subquery) {
          subquery
            .from('user_roles')
            .select('user_id')
            .eq('role', 'mentor');
        });

      if (error) throw error;

      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const isMentor = userRoles.includes('mentor') || userRoles.includes('admin');

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
          <p className="text-muted-foreground mt-1">Exchange wisdom, find mentors, grow together</p>
        </div>
        {isMentor && (
          <Button onClick={() => navigate('/dashboard/mentorship/create')} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Create Resource
          </Button>
        )}
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resources">My Resources</TabsTrigger>
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            resources.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <Card key={resource.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center text-sm">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Type: {resource.resource_type}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Created: {new Date(resource.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-3">
                      <Button variant="ghost" size="sm" className="ml-auto">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                {isMentor ? (
                  <>
                    <p className="text-muted-foreground mb-6">You haven't created any resources yet.</p>
                    <Button onClick={() => navigate('/dashboard/mentorship/create')}>
                      Create Your First Resource
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-6">
                      You don't have access to any mentor resources yet. Connect with a mentor to see their resources.
                    </p>
                    <Button onClick={() => navigate('/dashboard/mentorship?tab=mentors')}>
                      Find a Mentor
                    </Button>
                  </>
                )}
              </div>
            )
          )}
        </TabsContent>
        
        <TabsContent value="mentors">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            mentors.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <Card key={mentor.id}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={mentor.profiles?.avatar_url} alt={mentor.profiles?.full_name} />
                          <AvatarFallback>
                            {mentor.profiles?.full_name?.charAt(0) || 'M'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{mentor.profiles?.full_name}</CardTitle>
                          <CardDescription>
                            {mentor.expertise?.[0] || 'Mentorship'} • {mentor.experience_years || 0} yrs
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Badge variant="outline" className="mb-2 mr-2">
                          {mentor.industries?.[0] || 'General'}
                        </Badge>
                        {mentor.expertise?.[0] && (
                          <Badge variant="outline" className="mb-2 mr-2">
                            {mentor.expertise[0]}
                          </Badge>
                        )}
                        {mentor.expertise?.[1] && (
                          <Badge variant="outline" className="mb-2">
                            {mentor.expertise[1]}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">
                        Experienced mentor specializing in {mentor.expertise?.join(', ') || 'various fields'}.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">View Profile</Button>
                      <Button size="sm">Connect</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No mentors found</h3>
                <p className="text-muted-foreground mb-6">
                  There are no mentors available at the moment. Check back later.
                </p>
              </div>
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorshipPage;
