
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, profile, roles, isLoading, isAdmin, isMentor, isDisciple } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <div className="container mx-auto py-8 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name || user?.email}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin() 
              ? "You have administrator access to the Mind Mortal platform." 
              : isMentor() 
                ? "You are a mentor, ready to share your knowledge and wisdom."
                : "Welcome to your personal space for growth and legacy."}
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isAdmin() && <TabsTrigger value="admin">Admin</TabsTrigger>}
            {isMentor() && <TabsTrigger value="mentor">Mentor</TabsTrigger>}
            {isDisciple() && <TabsTrigger value="disciple">Disciple</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>View and update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Manage Profile</Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Legacy Vault</CardTitle>
                    <CardDescription>Access your personal legacy vault</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Open Vault</Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Manage your timeless messages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">View Messages</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {isAdmin() && (
            <TabsContent value="admin" className="space-y-4">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage users and roles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Manage Users</Button>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription>Configure system settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Settings</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}
          
          {isMentor() && (
            <TabsContent value="mentor" className="space-y-4">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Disciples</CardTitle>
                      <CardDescription>Manage your disciples</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">View Disciples</Button>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Sessions</CardTitle>
                      <CardDescription>Manage your mentoring sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">View Sessions</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}
          
          {isDisciple() && (
            <TabsContent value="disciple" className="space-y-4">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Find a Mentor</CardTitle>
                      <CardDescription>Connect with mentors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Search Mentors</Button>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>My Learning</CardTitle>
                      <CardDescription>Track your learning journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">View Progress</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;
