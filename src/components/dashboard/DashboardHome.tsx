
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Archive, Users, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

const DashboardHome: React.FC = () => {
  const { profile } = useAuth();
  
  // Mock data for demo purposes
  const stats = {
    legacyPosts: 5,
    wisdomPosts: 3,
    timelessMessages: 2,
    subscription: 'Pro',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    quota: {
      legacyPosts: { used: 5, total: 50 },
      wisdomPosts: { used: 3, total: 30 },
      timelessMessages: { used: 2, total: 20 }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome, {profile?.full_name || 'Explorer'}
        </h1>
        <p className="text-muted-foreground">
          Your journey of wisdom and legacy continues here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <CardTitle className="flex items-center">
                <Archive className="mr-2" />
                Legacy Vault
              </CardTitle>
              <CardDescription className="text-amber-100">
                Your personal legacy collection
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-2">{stats.legacyPosts}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {stats.legacyPosts} of {stats.quota.legacyPosts.total} posts created
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/dashboard/legacy-vault">View Vault</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardTitle className="flex items-center">
                <Users className="mr-2" />
                Wisdom Exchange
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Connect with mentors and wisdom
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-2">{stats.wisdomPosts}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {stats.wisdomPosts} of {stats.quota.wisdomPosts.total} insights shared
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/dashboard/wisdom-exchange">Explore Wisdom</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="flex items-center">
                <Clock className="mr-2" />
                Timeless Messages
              </CardTitle>
              <CardDescription className="text-blue-100">
                Messages for the future
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-2">{stats.timelessMessages}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {stats.timelessMessages} of {stats.quota.timelessMessages.total} messages created
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/dashboard/timeless-messages">View Messages</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Your current plan and usage details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Current Plan: {stats.subscription}</h3>
                <p className="text-sm text-muted-foreground">
                  Valid until: {stats.validUntil.toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <Button size="sm" className="mb-2">Upgrade Plan</Button>
                <Button variant="outline" size="sm">Manage Subscription</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              <Button asChild>
                <Link to="/dashboard/create">Create New Content</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/legacy-vault">Explore Public Gallery</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/wisdom-exchange">Find Mentors</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
