
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MentorApplication {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  expertise: string[] | null;
  industries: string[] | null;
  experience_years: number | null;
  is_verified: boolean | null;
  wisdom_rating: number | null;
  user_id: string;
  email: string;
}

const MentorApplicationsPage = () => {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // First get mentor verification statuses
      const { data: mentorData, error: mentorError } = await supabase
        .from('mentor_verification_status')
        .select('*');
        
      if (mentorError) throw mentorError;
      
      // Then get profile info for each applicant
      const mentorsWithProfiles = await Promise.all(
        (mentorData || []).map(async (mentor) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', mentor.id)
            .single();
            
          // Get user email from auth (requires admin rights)
          const { data: userData } = await supabase
            .from('admin_users')
            .select('email')
            .eq('id', mentor.id)
            .single();
            
          return {
            ...mentor,
            full_name: profileData?.full_name || 'Unknown',
            avatar_url: profileData?.avatar_url,
            user_id: mentor.id,
            email: userData?.email || 'No email'
          };
        })
      );
      
      setApplications(mentorsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching mentor applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (application: MentorApplication) => {
    try {
      setProcessingId(application.id);
      
      const { error } = await supabase.rpc('approve_mentor_verification', {
        mentor_id: application.user_id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Mentor approved',
        description: `${application.full_name} has been approved as a mentor`,
      });
      
      // Refresh applications
      fetchApplications();
    } catch (error: any) {
      console.error('Error approving mentor:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve mentor',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const viewDetails = (application: MentorApplication) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  return (
    <div className="container py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="mr-2 h-5 w-5" />
            Mentor Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No mentor applications found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={application.avatar_url || ''} alt={application.full_name || ''} />
                          <AvatarFallback>{application.full_name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{application.full_name}</div>
                          <div className="text-xs text-muted-foreground">{application.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {application.expertise?.slice(0, 2).map((exp, i) => (
                          <Badge key={i} variant="outline">{exp}</Badge>
                        ))}
                        {(application.expertise?.length || 0) > 2 && (
                          <Badge variant="outline">+{(application.expertise?.length || 0) - 2} more</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{application.experience_years} years</TableCell>
                    <TableCell>
                      {application.is_verified ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewDetails(application)}
                        >
                          View Details
                        </Button>
                        
                        {!application.is_verified && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApprove(application)}
                            disabled={processingId === application.id}
                          >
                            {processingId === application.id ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Processing
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Mentor Application Details</DialogTitle>
            <DialogDescription>
              Review the applicant's details and expertise
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4 my-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedApplication.avatar_url || ''} alt={selectedApplication.full_name || ''} />
                  <AvatarFallback>{selectedApplication.full_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{selectedApplication.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApplication.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Experience</h4>
                  <p>{selectedApplication.experience_years} years</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Wisdom Rating</h4>
                  <p>{selectedApplication.wisdom_rating || 'Not rated'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedApplication.expertise?.map((exp, i) => (
                    <Badge key={i} variant="secondary">{exp}</Badge>
                  ))}
                  {!selectedApplication.expertise?.length && <p className="text-muted-foreground text-sm">No expertise specified</p>}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Industries</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedApplication.industries?.map((ind, i) => (
                    <Badge key={i} variant="outline">{ind}</Badge>
                  ))}
                  {!selectedApplication.industries?.length && <p className="text-muted-foreground text-sm">No industries specified</p>}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            {selectedApplication && !selectedApplication.is_verified && (
              <Button 
                onClick={() => {
                  handleApprove(selectedApplication);
                  setIsDialogOpen(false);
                }}
                disabled={processingId === selectedApplication.id}
              >
                {processingId === selectedApplication.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve as Mentor
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorApplicationsPage;
