
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Settings, Shield, MessageSquare, Users, Archive } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, roles } = useAuth();

  const accountDetails = [
    {
      label: "Email",
      value: user?.email || "Not available",
      icon: Mail
    },
    {
      label: "Name",
      value: profile?.full_name || "Not set",
      icon: User
    },
    {
      label: "Account Type",
      value: roles.includes('admin') 
        ? 'Administrator' 
        : roles.includes('mentor') 
          ? 'Mentor' 
          : 'Standard User',
      icon: Shield
    }
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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
                {accountDetails.map((detail, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <detail.icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{detail.label}</p>
                      <p className="font-medium">{detail.value}</p>
                    </div>
                    {index < 2 && (
                      <Button variant="ghost" size="sm" className="text-primary">
                        Edit
                      </Button>
                    )}
                  </div>
                ))}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>Overview of your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accountStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <stat.icon className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="font-medium">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Your current plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-4">
                  <h3 className="font-medium text-primary">Premium Plan</h3>
                  <p className="text-sm">Renews on Dec 31, 2025</p>
                </div>
                <Button className="w-full">Manage Subscription</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
