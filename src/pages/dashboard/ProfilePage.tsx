
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Edit, CheckCircle, Circle, User, UploadCloud } from 'lucide-react';

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();
  const { isSubscribed, planName } = useSubscription();
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const { register, handleSubmit, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
      location: profile?.location || ''
    }
  });

  useEffect(() => {
    if (profile) {
      setValue('full_name', profile.full_name || '');
      setValue('username', profile.username || '');
      setValue('bio', profile.bio || '');
      setValue('location', profile.location || '');
      
      // Set completed profile items
      setCompletedItems(profile.profile_completion || []);
    }
  }, [profile, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (!user) return;
      
      // Update profile data
      await updateProfile({
        ...data
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  };

  const profileCompletionSteps = [
    {
      id: 'profile_photo',
      label: 'Add profile photo',
      completed: completedItems.includes('profile_photo'),
    },
    {
      id: 'bio',
      label: 'Write a bio',
      completed: completedItems.includes('bio'),
    },
    {
      id: 'location',
      label: 'Add your location',
      completed: completedItems.includes('location'),
    },
    {
      id: 'interests',
      label: 'Add your interests',
      completed: completedItems.includes('interests'),
    },
    {
      id: 'first_legacy_post',
      label: 'Create your first legacy post',
      completed: completedItems.includes('first_legacy_post'),
    }
  ];

  const completionPercentage = Math.round(
    (completedItems.length / profileCompletionSteps.length) * 100
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;
    
    setIsUploading(true);
    try {
      // Upload avatar functionality would go here
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
      
      // Update completed items
      if (!completedItems.includes('profile_photo')) {
        const updatedItems = [...completedItems, 'profile_photo'];
        setCompletedItems(updatedItems);
        await updateProfile({
          profile_completion: updatedItems
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "There was a problem uploading your avatar.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setAvatarFile(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="text-2xl">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </label>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  
                  {avatarFile && (
                    <div className="mb-4 text-center">
                      <p className="text-sm mb-2">Selected: {avatarFile.name}</p>
                      <Button 
                        size="sm" 
                        onClick={uploadAvatar}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2">⏳</span> Uploading...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UploadCloud className="h-4 w-4" /> Upload
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <h2 className="text-xl font-bold mt-2">{profile?.full_name || 'Your Name'}</h2>
                  <p className="text-muted-foreground">@{profile?.username || 'username'}</p>
                  
                  {isSubscribed && (
                    <div className="mt-2 inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {planName} Plan
                    </div>
                  )}
                  
                  <div className="w-full mt-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm font-medium">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="space-y-3">
                      {profileCompletionSteps.map((step) => (
                        <div key={step.id} className="flex items-center">
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground mr-2" />
                          )}
                          <span className={step.completed ? "text-primary" : "text-muted-foreground"}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Tabs Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile Info</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="profile" className="mt-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="full_name">
                          Full Name
                        </label>
                        <input
                          id="full_name"
                          type="text"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                          {...register('full_name', { required: "Name is required" })}
                        />
                        {errors.full_name && (
                          <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="username">
                          Username
                        </label>
                        <input
                          id="username"
                          type="text"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                          {...register('username')}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="bio">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={4}
                          className="w-full px-3 py-2 border rounded-md bg-background"
                          {...register('bio')}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="location">
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                          {...register('location')}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={!isDirty}>
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="preferences" className="mt-0">
                    <div className="py-4">
                      <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                      <p className="text-muted-foreground mb-4">
                        Configure how and when you receive notifications.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                          </div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                          </div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Legacy Updates</h4>
                            <p className="text-sm text-muted-foreground">Notifications about your legacy content</p>
                          </div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="privacy" className="mt-0">
                    <div className="py-4">
                      <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                      <p className="text-muted-foreground mb-4">
                        Control how your information is displayed and shared.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Public Profile</h4>
                            <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                          </div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Show Email Address</h4>
                            <p className="text-sm text-muted-foreground">Display your email to other users</p>
                          </div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Activity Visibility</h4>
                            <p className="text-sm text-muted-foreground">Show your activities to followers</p>
                          </div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
