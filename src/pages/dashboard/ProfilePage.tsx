import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, UserCircle, MapPin, Mail, Phone, Edit, Camera, CheckSquare, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import DashboardAnimatedBackground from '@/components/dashboard/DashboardAnimatedBackground';

interface ProfileFormData {
  full_name: string;
  username: string;
  bio: string;
  location: string;
  phone: string;
  avatar_url: string | null;
}

interface ProfileCompletionTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  action: () => void;
}

const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    phone: '',
    avatar_url: null
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url
      });
      setAvatarPreview(profile.avatar_url || null);
      
      // Fetch profile completion from the database
      fetchProfileCompletion();
    }
  }, [profile]);

  const fetchProfileCompletion = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_completion')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile completion:', error);
        return;
      }
      
      if (data) {
        // If profile_completion exists, use it
        if (data.profile_completion) {
          setCompletedTasks(data.profile_completion);
          calculateProfileCompletion(data.profile_completion);
        } else {
          // Otherwise, calculate based on profile data
          const completed: string[] = [];
          if (profile?.full_name) completed.push('add_name');
          if (profile?.bio) completed.push('add_bio');
          if (profile?.avatar_url) completed.push('add_avatar');
          if (profile?.location) completed.push('add_location');
          
          setCompletedTasks(completed);
          calculateProfileCompletion(completed);
        }
      }
    } catch (err) {
      console.error('Error in profile completion fetch:', err);
    }
  };

  const calculateProfileCompletion = (completed: string[]) => {
    const totalTasks = getProfileCompletionTasks().length;
    const completedCount = completed.length;
    const percentage = Math.floor((completedCount / totalTasks) * 100);
    setProfileCompletionPercentage(percentage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
        
      if (error) {
        console.error('Error uploading avatar:', error);
        return null;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Error in avatar upload:', err);
      return null;
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      let avatarUrl = formData.avatar_url;
      
      // If new avatar was uploaded, process it
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Refresh the profile in the auth context
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      
      setIsEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;
    
    try {
      // Don't add duplicates
      if (completedTasks.includes(taskId)) return;
      
      const updatedTasks = [...completedTasks, taskId];
      
      // Update in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_completion: updatedTasks
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile completion:', error);
        
        // If profile_completion column doesn't exist, add it
        if (error.code === 'PGRST116') {
          // We need to add the column first
          toast({
            title: "Profile updated",
            description: "Task marked as completed."
          });
          
          // For now, just update the local state
          setCompletedTasks(updatedTasks);
          calculateProfileCompletion(updatedTasks);
          return;
        }
        
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setCompletedTasks(updatedTasks);
      calculateProfileCompletion(updatedTasks);
      
      toast({
        title: "Task completed",
        description: "Profile task marked as completed."
      });
    } catch (err) {
      console.error('Error completing task:', err);
      toast({
        title: "Error completing task",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const getProfileCompletionTasks = (): ProfileCompletionTask[] => {
    return [
      {
        id: 'add_name',
        title: 'Add your name',
        description: 'Add your full name to your profile.',
        completed: completedTasks.includes('add_name'),
        points: 10,
        action: () => setIsEditMode(true)
      },
      {
        id: 'add_bio',
        title: 'Add a bio',
        description: 'Write a short bio about yourself.',
        completed: completedTasks.includes('add_bio'),
        points: 15,
        action: () => setIsEditMode(true)
      },
      {
        id: 'add_avatar',
        title: 'Add a profile picture',
        description: 'Upload a profile picture to personalize your account.',
        completed: completedTasks.includes('add_avatar'),
        points: 10,
        action: () => setIsEditMode(true)
      },
      {
        id: 'add_location',
        title: 'Add your location',
        description: 'Let people know where you are from.',
        completed: completedTasks.includes('add_location'),
        points: 5,
        action: () => setIsEditMode(true)
      },
      {
        id: 'create_legacy',
        title: 'Create your first legacy post',
        description: 'Start your legacy by creating your first post.',
        completed: completedTasks.includes('create_legacy'),
        points: 20,
        action: () => window.location.href = '/dashboard/create'
      }
    ];
  };

  // Animation variants
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
    <DashboardAnimatedBackground objectCount={4}>
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information and profile settings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/30 to-secondary/30 h-24 relative"></div>
                <div className="px-6 -mt-12 pb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt={formData.full_name || 'Profile'} 
                        className="rounded-full border-4 border-background object-cover w-full h-full"
                      />
                    ) : (
                      <div className="rounded-full border-4 border-background bg-muted w-full h-full flex items-center justify-center">
                        <UserCircle className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">{formData.full_name || 'Anonymous User'}</h2>
                    <p className="text-muted-foreground">{formData.username || user?.email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.bio && (
                      <p className="text-sm">{formData.bio}</p>
                    )}
                    
                    {formData.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                    
                    {formData.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                      onClick={() => setIsEditMode(true)}
                    >
                      <Edit className="h-4 w-4" /> Edit Profile
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                  <CardDescription>{profileCompletionPercentage}% Complete</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-secondary/30 rounded-full mb-4">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${profileCompletionPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="space-y-3">
                    {getProfileCompletionTasks().map(task => (
                      <div key={task.id} className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${task.completed ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <CheckSquare className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{task.title}</p>
                            <Badge variant="outline">{task.points} pts</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        </div>
                        {!task.completed && (
                          <Button variant="ghost" size="sm" onClick={() => {
                            task.action();
                            completeTask(task.id);
                          }}>
                            Do it
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Profile Details/Edit */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditMode ? 'Edit Profile' : 'Profile Details'}</CardTitle>
                  <CardDescription>
                    {isEditMode 
                      ? 'Update your personal information' 
                      : 'Your personal information and preferences'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isEditMode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input 
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Your username"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Your location"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {avatarPreview ? (
                              <img 
                                src={avatarPreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserCircle className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <Label htmlFor="avatar-input" className="cursor-pointer">
                              <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted/50 transition-colors">
                                <Camera className="h-4 w-4" />
                                <span>Choose Image</span>
                              </div>
                              <input 
                                id="avatar-input"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                              />
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                          <p>{formData.full_name || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                          <p>{formData.username || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                        <p className="whitespace-pre-line">{formData.bio || 'Not provided'}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                          <p>{formData.location || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                          <p>{formData.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {isEditMode && (
                  <CardFooter className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditMode(false);
                        // Reset form data
                        if (profile) {
                          setFormData({
                            full_name: profile.full_name || '',
                            username: profile.username || '',
                            bio: profile.bio || '',
                            location: profile.location || '',
                            phone: profile.phone || '',
                            avatar_url: profile.avatar_url
                          });
                          setAvatarPreview(profile.avatar_url || null);
                        }
                        setAvatarFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={updateProfile}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              <Tabs defaultValue="account" className="mt-6">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Manage your account settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>Email Verification</span>
                          </div>
                          <Badge className="bg-green-500">{user?.email_confirmed_at ? 'Verified' : 'Pending'}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <span>Account Status</span>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your security preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Security settings will be available soon.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Notification settings will be available soon.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardAnimatedBackground>
  );
};

export default ProfilePage;
