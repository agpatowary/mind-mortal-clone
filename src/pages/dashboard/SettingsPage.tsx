
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import PricingPlans from '@/components/subscription/PricingPlans';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Email settings
  const [emailNotifications, setEmailNotifications] = useState({
    comments: true,
    mentions: true,
    messages: true,
    updates: false,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showLocation: true,
    publicProfile: true,
  });
  
  const handlePasswordChange = async () => {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'New password and confirmation must match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoadingPasswordChange(true);
      
      // Update password via Supabase Auth API
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error updating password',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPasswordChange(false);
    }
  };

  const handleEmailSettingsChange = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const handlePrivacySettingsChange = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const handleAccountDeletion = async () => {
    // Confirmation would be implemented here
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      try {
        // Delete account via Supabase Auth API
        const { error } = await supabase.auth.admin.deleteUser(user!.id);
        
        if (error) throw error;
        
        await signOut();
        navigate('/');
        
        toast({
          title: 'Account deleted',
          description: 'Your account has been successfully deleted.',
        });
      } catch (error: any) {
        console.error('Error deleting account:', error);
        toast({
          title: 'Error deleting account',
          description: error.message || 'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="email">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View and manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="block mb-2">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        To change your email, please contact support.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="block mb-2">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword" className="block mb-2">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword" className="block mb-2">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={isLoadingPasswordChange || !currentPassword || !newPassword || !confirmPassword}
                      >
                        {isLoadingPasswordChange ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-destructive/20 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-destructive mb-2">Delete Account</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. This action is permanent.
                      </p>
                      <Button 
                        variant="destructive" 
                        onClick={handleAccountDeletion}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage how we contact you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Comments</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when someone comments on your posts
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications.comments} 
                      onCheckedChange={() => handleEmailSettingsChange('comments')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Mentions</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when someone mentions you
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications.mentions} 
                      onCheckedChange={() => handleEmailSettingsChange('mentions')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Direct Messages</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when someone sends you a message
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications.messages} 
                      onCheckedChange={() => handleEmailSettingsChange('messages')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Platform Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and updates
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications.updates} 
                      onCheckedChange={() => handleEmailSettingsChange('updates')} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Email Address</h3>
                      <p className="text-sm text-muted-foreground">
                        Make your email visible to other users
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.showEmail} 
                      onCheckedChange={() => handlePrivacySettingsChange('showEmail')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Location</h3>
                      <p className="text-sm text-muted-foreground">
                        Display your location on your profile
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.showLocation} 
                      onCheckedChange={() => handlePrivacySettingsChange('showLocation')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Public Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Allow your profile to be visible to non-registered users
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.publicProfile} 
                      onCheckedChange={() => handlePrivacySettingsChange('publicProfile')} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>Choose the plan that works for you</CardDescription>
              </CardHeader>
              <CardContent>
                <PricingPlans />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
