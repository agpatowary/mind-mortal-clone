
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, BookOpen, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MentorResource {
  id: string;
  title: string;
  description: string;
  resourcesCount: number;
  createdAt: string;
}

interface Mentor {
  id: string;
  fullName: string;
  specialty: string;
  experience: string;
  description: string;
}

const MentorshipPage = () => {
  const navigate = useNavigate();
  const { user, isMentor } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<MentorResource[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch resources and mentors data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('wisdom_resources')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });
        
        if (resourcesError) throw resourcesError;
        
        // Fetch mentors
        const { data: mentorsData, error: mentorsError } = await supabase
          .from('profiles')
          .select(`
            id, 
            full_name, 
            bio,
            mentor_profiles!inner (
              expertise,
              experience_years,
              industries
            )
          `)
          .eq('user_roles.role', 'mentor')
          .not('mentor_profiles', 'is', null);
        
        if (mentorsError) throw mentorsError;
        
        // Format resources data
        const formattedResources = resourcesData?.map(item => ({
          id: item.id,
          title: item.title || 'Untitled Resource',
          description: item.description || 'No description available',
          resourcesCount: 3, // Placeholder for now
          createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'
        })) || [];

        // Format mentors data
        const formattedMentors = mentorsData?.map(item => ({
          id: item.id,
          fullName: item.full_name || 'Anonymous',
          specialty: item.mentor_profiles?.expertise?.[0] || 'General Mentorship',
          experience: `${item.mentor_profiles?.experience_years || 0} yrs`,
          description: item.bio || 'Experienced mentor ready to help with your growth journey.'
        })) || [];

        setResources(formattedResources);
        setMentors(formattedMentors);
      } catch (error) {
        console.error('Error fetching mentorship data:', error);
        toast({
          title: 'Failed to load data',
          description: 'There was a problem loading the mentorship data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading resources...</p>
              </div>
            </div>
          ) : resources.length > 0 ? (
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
                      <span>Shared resources: {resource.resourcesCount}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Created: {resource.createdAt}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 px-6 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => navigate(`/dashboard/mentorship/resource/${resource.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-6">
                  {isMentor() ? 
                    "You haven't created any resources yet. Create your first resource to share your knowledge." : 
                    "Connect with mentors to access their resources and expand your knowledge."}
                </p>
                {isMentor() && (
                  <Button onClick={() => navigate('/dashboard/mentorship/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Resource
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="mentors">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">Finding mentors...</p>
              </div>
            </div>
          ) : mentors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle>{mentor.fullName}</CardTitle>
                        <CardDescription>{mentor.specialty} • {mentor.experience}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{mentor.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/dashboard/mentorship/mentor/${mentor.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/dashboard/mentorship/connect/${mentor.id}`)}
                    >
                      Connect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
                <p className="text-muted-foreground">We're still growing our mentor community. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorshipPage;
