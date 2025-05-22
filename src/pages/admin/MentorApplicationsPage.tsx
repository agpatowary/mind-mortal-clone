
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Eye, Search, FilterX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface MentorApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  expertise: string[];
  industries: string[];
  experience_years: number;
  monthly_availability: number;
  application_date: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

const MentorApplicationsPage = () => {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<MentorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewApplication, setViewApplication] = useState<MentorApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMentorApplications();
  }, []);

  useEffect(() => {
    // Apply filters when applications, search query, or status filter changes
    let filtered = [...applications];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.full_name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.expertise.some(exp => exp.toLowerCase().includes(query)) ||
        app.industries.some(ind => ind.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  const fetchMentorApplications = async () => {
    try {
      setIsLoading(true);
      
      // First get all mentor profiles
      const { data: mentorProfiles, error: profilesError } = await supabase
        .from('mentor_profiles')
        .select(`
          id,
          expertise,
          industries,
          experience_years,
          monthly_availability,
          created_at
        `);
      
      if (profilesError) throw profilesError;
      
      if (!mentorProfiles || mentorProfiles.length === 0) {
        setApplications([]);
        setFilteredApplications([]);
        setIsLoading(false);
        return;
      }
      
      // Now for each mentor profile, get the user details from profiles table
      const formattedApplications: MentorApplication[] = [];
      
      for (const profile of mentorProfiles) {
        // Get user details
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select(`
            full_name,
            email,
            avatar_url
          `)
          .eq('id', profile.id)
          .single();
          
        if (userError) {
          console.error('Error fetching user data for mentor:', userError);
          continue;
        }
        
        // Check if user already has mentor role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.id)
          .eq('role', 'mentor');
          
        if (roleError) {
          console.error('Error checking role for mentor:', roleError);
          continue;
        }
        
        // If user doesn't have mentor role, they are applying
        const status = roleData && roleData.length > 0 ? 'approved' : 'pending';
        
        formattedApplications.push({
          id: profile.id,
          user_id: profile.id,
          full_name: userData?.full_name || 'Unknown',
          email: userData?.email || 'No email',
          avatar_url: userData?.avatar_url || '',
          expertise: profile.expertise || [],
          industries: profile.industries || [],
          experience_years: profile.experience_years || 0,
          monthly_availability: profile.monthly_availability || 0,
          application_date: profile.created_at,
          status: status,
        });
      }
      
      setApplications(formattedApplications);
      setFilteredApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching mentor applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor applications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      setIsSubmitting(true);
      
      // Call the RPC function to approve mentor
      const { error } = await supabase.rpc('approve_mentor_verification', {
        mentor_id: userId
      });
      
      if (error) throw error;
      
      toast({
        title: 'Application approved',
        description: 'The mentor application has been approved successfully.',
      });
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.user_id === userId ? { ...app, status: 'approved' } : app
        )
      );
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (!rejectionReason) {
      toast({
        title: 'Rejection reason required',
        description: 'Please provide a reason for rejecting this application.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real application, you would have an RPC function for rejection as well
      // For now, we'll just update the local state
      
      toast({
        title: 'Application rejected',
        description: 'The mentor application has been rejected.',
      });
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.user_id === userId 
            ? { ...app, status: 'rejected', rejection_reason: rejectionReason } 
            : app
        )
      );
      
      // Close dialog
      setViewApplication(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mentor Applications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Applications</CardTitle>
          <CardDescription>Review and process mentor verification requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </Button>
              
              {(searchQuery || statusFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <TableRow key={application.user_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={application.avatar_url} alt={application.full_name} />
                              <AvatarFallback>{application.full_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{application.full_name}</p>
                              <p className="text-sm text-muted-foreground">{application.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {application.expertise.slice(0, 2).map((exp, i) => (
                              <Badge key={i} variant="outline" className="mr-1 mb-1">
                                {exp}
                              </Badge>
                            ))}
                            {application.expertise.length > 2 && (
                              <Badge variant="outline" className="mr-1 mb-1">
                                +{application.expertise.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {application.experience_years} years
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(application.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewApplication(application)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {application.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApprove(application.user_id)}
                                  disabled={isSubmitting}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setViewApplication(application)}
                                  disabled={isSubmitting}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={!!viewApplication} onOpenChange={(open) => !open && setViewApplication(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review mentor application details
            </DialogDescription>
          </DialogHeader>
          
          {viewApplication && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={viewApplication.avatar_url} alt={viewApplication.full_name} />
                  <AvatarFallback>{viewApplication.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{viewApplication.full_name}</h3>
                  <p className="text-muted-foreground">{viewApplication.email}</p>
                  <p className="text-sm mt-1">
                    Applied on {new Date(viewApplication.application_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(viewApplication.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-1">
                    {viewApplication.expertise.map((exp, i) => (
                      <Badge key={i} variant="outline" className="mr-1 mb-1">
                        {exp}
                      </Badge>
                    ))}
                    {viewApplication.expertise.length === 0 && (
                      <p className="text-sm text-muted-foreground">No expertise specified</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Industries</h4>
                  <div className="flex flex-wrap gap-1">
                    {viewApplication.industries.map((ind, i) => (
                      <Badge key={i} variant="secondary" className="mr-1 mb-1">
                        {ind}
                      </Badge>
                    ))}
                    {viewApplication.industries.length === 0 && (
                      <p className="text-sm text-muted-foreground">No industries specified</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Experience</h4>
                  <p>{viewApplication.experience_years} years</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Monthly Availability</h4>
                  <p>{viewApplication.monthly_availability} hours per month</p>
                </div>
              </div>
              
              {viewApplication.status === 'rejected' && viewApplication.rejection_reason && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-destructive">Rejection Reason</h4>
                  <p className="text-sm bg-destructive/10 p-3 rounded">
                    {viewApplication.rejection_reason}
                  </p>
                </div>
              )}
              
              {viewApplication.status === 'pending' && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Rejection Reason (Required for rejection)
                  </h4>
                  <Textarea
                    placeholder="Provide a reason for rejecting this application..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2">
            {viewApplication?.status === 'pending' && (
              <div className="flex gap-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => handleApprove(viewApplication.user_id)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(viewApplication.user_id)}
                  disabled={isSubmitting || !rejectionReason}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
            
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorApplicationsPage;
