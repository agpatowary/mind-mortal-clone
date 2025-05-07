import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, Mail, Settings, Shield, MessageSquare, Users, Archive, Upload, Home, Phone, FileText, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ProfileCompletionType {
  percent: number;
  completed_tasks: string[];
  pending_tasks: string[];
}

interface ProfileType {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  profile_completion?: ProfileCompletionType;
}

const ProfilePage: React.FC = () => {
  const { user, profile: initialProfile, roles } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data || null);
      }
    } catch (err) {
      console.error('Error in fetch operation:', err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (task: string) => {
    if (!profile || !user) return;

    // Mock complete task - in a real app, this would save the actual profile data
    toast({
      title: "Complete your profile",
      description: `Please update your ${task} to complete this task.`,
    });
  };

  // Calculate account stats
  const accountStats = [
    {
      label: "Timeless Messages",
      value: 5,
      icon: MessageSquare
    },
    {
      label: "Wisdom Posts",
      value: 8,
      icon: Users
    },
    {
      label: "Legacy Items",
      value: 12,
      icon: Archive
    }
  ];

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const completionTasks = [
    { id: 'full_name', label: 'Add your full name', icon: User },
    { id: 'avatar_url', label: 'Upload profile picture', icon: Upload },
    { id: 'bio', label: 'Add a short bio', icon: FileText },
    { id: 'location', label: 'Add your location', icon: Home },
    { id: 'phone', label: 'Add your phone number', icon: Phone },
  ];

  return (
    <div className="container mx-auto max-w-6xl">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left sidebar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                  <AvatarFallback className="text-xl">{getInitials(profile?.full_name)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.full_name || 'Welcome'}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  {user?.email}
                </p>
                
                <div className="w-full mt-2 mb-6">
                  <Progress className="h-2" value={profile?.profile_completion?.percent || 20} />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your profile is {profile?.profile_completion?.percent || 20}% complete
                  </p>
                </div>
                
                <div className="w-full">
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-sm font-medium">Plan</span>
                    <span className="text-sm text-primary font-medium">Premium</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-sm font-medium">Renewal</span>
                    <span className="text-sm">Dec 31, 2025</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm">45% used</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t">
                    <span className="text-sm font-medium">Notifications</span>
                    <span className="text-sm">3 unread</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right content area */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="profile">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>Your personal account details</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Mail className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user?.email || "Not available"}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Edit
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{profile?.full_name || "Not set"}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Edit
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Shield className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Account Type</p>
                        <p className="font-medium">
                          {roles.includes('admin') 
                            ? 'Administrator' 
                            : roles.includes('mentor') 
                              ? 'Mentor' 
                              : 'Standard User'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-lg font-medium mb-4">Account Security</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        Two-Factor Authentication
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completion">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Profile Completion</CardTitle>
                  <CardDescription>Complete your profile to get the most out of Mind Mortal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Your profile is {profile?.profile_completion?.percent || 20}% complete</h3>
                      <span className="text-sm font-medium">{profile?.profile_completion?.percent || 20}%</span>
                    </div>
                    <Progress value={profile?.profile_completion?.percent || 20} className="h-2" />
                  </div>
                  
                  <div className="space-y-4">
                    {completionTasks.map(task => {
                      const isCompleted = profile?.profile_completion?.completed_tasks.includes(task.id);
                      return (
                        <Card key={task.id} className={isCompleted ? "border-green-200 bg-green-50" : ""}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted ? "bg-green-100" : "bg-secondary"
                              }`}>
                                <task.icon className={`h-5 w-5 ${
                                  isCompleted ? "text-green-600" : "text-muted-foreground"
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium">{task.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {isCompleted ? "Completed" : "Incomplete"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <div className="rounded-full bg-green-100 w-8 h-8 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-green-600" />
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => completeTask(task.id)}
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Why complete your profile?</p>
                      <p className="text-sm text-amber-700 mt-1">
                        A complete profile helps your legacy content be properly attributed and makes it easier for others to connect with you in the wisdom exchange.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-primary">Premium Plan</h3>
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                    </div>
                    <p className="text-sm mb-1">Renews on Dec 31, 2025</p>
                    <p className="text-sm text-muted-foreground">$9.99/month</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button size="sm" variant="outline">Change Plan</Button>
                      <Button size="sm" variant="outline" className="text-destructive">Cancel</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Payment Method</span>
                      <span className="text-sm">Visa ending in 4242</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Billing Cycle</span>
                      <span className="text-sm">Monthly</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Next Invoice</span>
                      <span className="text-sm">Dec 31, 2025 - $9.99</span>
                    </div>
                  </div>
                  
                  <Button className="mt-6 w-full" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Billing History
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                      <div className="space-y-2">
                        {/* Notification preferences would go here */}
                        <p className="text-muted-foreground">Configure how and when you receive notifications</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                      <div className="space-y-2">
                        {/* Privacy settings would go here */}
                        <p className="text-muted-foreground">Control who can see your profile and content</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Language & Region</h3>
                      <div className="space-y-2">
                        {/* Language settings would go here */}
                        <p className="text-muted-foreground">Set your preferred language and timezone</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg text-destructive font-medium mb-2">Danger Zone</h3>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {accountStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
