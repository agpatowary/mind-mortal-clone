
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Import the custom icons we created
const LegacyIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"/>
    <path d="M12 8v8M8 12h8"/>
    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
  </svg>
);

const WisdomIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M12 7v10M7 12h10"/>
    <path d="M7 17.5C7 18.9 9.2 20 12 20s5-1.1 5-2.5-2.2-2.5-5-2.5-5 1.1-5 2.5z"/>
  </svg>
);

const TimelessIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
    <path d="M16 8.6c1 1.1 1.7 2.5 1.9 4"/>
  </svg>
);

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
    <div className="space-y-6 w-full">
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
          <Card className="overflow-hidden bg-gradient-to-br from-[#2A2F3C] to-[#1A1F2C] border-[#3A3F4C]">
            <CardHeader className="bg-gradient-to-r from-amber-600/20 to-amber-600/10">
              <CardTitle className="flex items-center text-amber-400">
                <LegacyIcon />
                <span className="ml-2">Legacy Vault</span>
              </CardTitle>
              <CardDescription className="text-amber-200/70">
                Your personal legacy collection
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-2">{stats.legacyPosts}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {stats.legacyPosts} of {stats.quota.legacyPosts.total} posts created
              </div>
              <Button asChild size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
                <Link to="/dashboard/legacy-vault">View Vault</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-gradient-to-br from-[#2A2F3C] to-[#1A1F2C] border-[#3A3F4C]">
            <CardHeader className="bg-gradient-to-r from-emerald-600/20 to-emerald-600/10">
              <CardTitle className="flex items-center text-emerald-400">
                <WisdomIcon />
                <span className="ml-2">Wisdom Exchange</span>
              </CardTitle>
              <CardDescription className="text-emerald-200/70">
                Connect with mentors and wisdom
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-2">{stats.wisdomPosts}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {stats.wisdomPosts} of {stats.quota.wisdomPosts.total} insights shared
              </div>
              <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Link to="/dashboard/wisdom-exchange">Explore Wisdom</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-gradient-to-br from-[#2A2F3C] to-[#1A1F2C] border-[#3A3F4C]">
            <CardHeader className="bg-gradient-to-r from-blue-600/20 to-blue-600/10">
              <CardTitle className="flex items-center text-blue-400">
                <TimelessIcon />
                <span className="ml-2">Timeless Messages</span>
              </CardTitle>
              <CardDescription className="text-blue-200/70">
                Messages for the future
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold mb-2">{stats.timelessMessages}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {stats.timelessMessages} of {stats.quota.timelessMessages.total} messages created
              </div>
              <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/dashboard/timeless-messages">View Messages</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-[#2A2F3C] to-[#1A1F2C] border-[#3A3F4C]">
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
                <Button size="sm" className="mb-2 bg-primary hover:bg-primary/90">Upgrade Plan</Button>
                <Button variant="outline" size="sm" className="border-[#3A3F4C] hover:bg-[#2A2F3C]">Manage Subscription</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-[#2A2F3C] to-[#1A1F2C] border-[#3A3F4C]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/dashboard/create">Create New Content</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#3A3F4C] hover:bg-[#2A2F3C]">
                <Link to="/dashboard/legacy-vault">Explore Public Gallery</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#3A3F4C] hover:bg-[#2A2F3C]">
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
