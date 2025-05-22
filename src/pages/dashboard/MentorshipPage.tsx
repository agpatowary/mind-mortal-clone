
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, BookOpen, Search, Filter, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const MentorshipPage = () => {
  const { user, isMentor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [expertiseOptions, setExpertiseOptions] = useState<string[]>([]);
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  
  useEffect(() => {
    fetchResources();
    fetchMentors();
  }, [user]);
  
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      
      if (!user) return;
      
      // If user is a mentor, get their own resources
      // If user is a mentee, get resources from mentors they are connected with
      let query = supabase
        .from('wisdom_resources')
        .select('*');
      
      if (isMentor()) {
        query = query.eq('created_by', user.id);
      } else {
        // For mentees, get resources from connected mentors
        // First, get all mentors the user is connected with
        const { data: matches } = await supabase
          .from('mentor_mentee_matches')
          .select('mentor_id')
          .eq('mentee_id', user.id)
          .eq('status', 'accepted');
        
        if (matches && matches.length > 0) {
          const mentorIds = matches.map(match => match.mentor_id);
          query = query.in('created_by', mentorIds);
        } else {
          // If no connected mentors, show public resources
          query = query.eq('is_public', true);
        }
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
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
  
  const fetchMentors = async () => {
    try {
      if (!user) return;
      
      // Get all verified mentors
      const { data: mentorData, error: mentorError } = await supabase.rpc('get_mentor_matches', {
        mentee_id: user.id
      });
      
      if (mentorError) throw mentorError;
      
      // Extract unique expertise and industries for filters
      const allExpertise = mentorData?.flatMap(mentor => mentor.expertise || []) || [];
      const allIndustries = mentorData?.flatMap(mentor => mentor.industries || []) || [];
      
      setExpertiseOptions([...new Set(allExpertise)]);
      setIndustryOptions([...new Set(allIndustries)]);
      setMentors(mentorData || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };
  
  const handleCreateResource = () => {
    if (!isMentor()) {
      toast({
        title: 'Permission Denied',
        description: 'Only mentors can create wisdom resources.',
        variant: 'destructive',
      });
      return;
    }
    
    navigate('/dashboard/mentorship/create');
  };
  
  // Filter mentors based on search query and filters
  const filteredMentors = mentors.filter(mentor => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      mentor.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by expertise
    const matchesExpertise = !expertiseFilter || 
      (mentor.expertise && mentor.expertise.some(exp => exp.toLowerCase() === expertiseFilter.toLowerCase()));
    
    // Filter by industry
    const matchesIndustry = !industryFilter || 
      (mentor.industries && mentor.industries.some(ind => ind.toLowerCase() === industryFilter.toLowerCase()));
    
    return matchesSearch && matchesExpertise && matchesIndustry;
  });
  
  const clearFilters = () => {
    setSearchQuery('');
    setExpertiseFilter('');
    setIndustryFilter('');
  };
  
  const renderResources = () => {
    if (resources.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No resources available</h3>
          <p className="text-muted-foreground mt-2">
            {isMentor() 
              ? "You haven't created any wisdom resources yet."
              : "No resources available from your mentors."}
          </p>
          {isMentor() && (
            <Button className="mt-4" onClick={handleCreateResource}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Resource
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
              <CardDescription>{resource.resource_type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {resource.description || 'No description provided'}
              </p>
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {resource.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {new Date(resource.created_at).toLocaleDateString()}
              </p>
              <Button variant="ghost" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                View Resource
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mentorship</h1>
        {isMentor() && (
          <Button onClick={handleCreateResource}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Resource
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="resources">My Resources</TabsTrigger>
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            renderResources()
          )}
        </TabsContent>
        
        <TabsContent value="mentors">
          <Card>
            <CardHeader>
              <CardTitle>Find the Right Mentor</CardTitle>
              <CardDescription>Connect with mentors that match your interests and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search mentors..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-2">
                  <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Expertise</SelectItem>
                      {expertiseOptions.map((expertise, index) => (
                        <SelectItem key={index} value={expertise}>
                          {expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Industries</SelectItem>
                      {industryOptions.map((industry, index) => (
                        <SelectItem key={index} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {(searchQuery || expertiseFilter || industryFilter) && (
                    <Button variant="ghost" size="icon" onClick={clearFilters}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {filteredMentors.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">No mentors found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search criteria or check back later.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredMentors.map((mentor) => (
                    <div key={mentor.mentor_id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar_url} alt={mentor.full_name} />
                          <AvatarFallback>{mentor.full_name?.charAt(0) || 'M'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{mentor.full_name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>{mentor.experience_years} years experience</span>
                            <span className="mx-2">•</span>
                            <span>{mentor.wisdom_rating} rating</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 mt-4 md:mt-0">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {mentor.expertise?.slice(0, 3).map((expertise: string, i: number) => (
                            <Badge key={i} variant="secondary" className="mr-1">
                              {expertise}
                            </Badge>
                          ))}
                          {mentor.expertise?.length > 3 && (
                            <Badge variant="outline">+{mentor.expertise.length - 3}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Industries:</strong> {mentor.industries?.join(', ') || 'Not specified'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500">
                          {mentor.match_score}% Match
                        </Badge>
                        <Button size="sm">Connect</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MentorshipPage;
