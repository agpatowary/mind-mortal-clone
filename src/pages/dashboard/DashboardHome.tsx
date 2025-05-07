
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, MessageSquare, Users } from 'lucide-react';

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

const DashboardHome: React.FC = () => {
  const { user, profile } = useAuth();
  
  // These would be fetched from an API in a real application
  const analytics = {
    legacyPosts: 12,
    wisdomPosts: 8,
    timelessMessages: 5,
    quotas: {
      legacy: 50,
      wisdom: 30,
      timeless: 20
    },
    subscription: {
      plan: "Premium",
      expiry: "2025-12-31"
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">
          Welcome, {profile?.full_name || user?.email}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your activity and remaining quotas.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-amber-600/5">
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-amber-500" />
                Legacy Vault
              </CardTitle>
              <CardDescription>Your stored memories and wisdom</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold mb-2">{analytics.legacyPosts}</div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{analytics.quotas.legacy - analytics.legacyPosts}</span> posts remaining out of <span className="font-medium">{analytics.quotas.legacy}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Wisdom Exchange
              </CardTitle>
              <CardDescription>Your shared knowledge and insights</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold mb-2">{analytics.wisdomPosts}</div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{analytics.quotas.wisdom - analytics.wisdomPosts}</span> posts remaining out of <span className="font-medium">{analytics.quotas.wisdom}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-500/10 to-green-600/5">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                Timeless Messages
              </CardTitle>
              <CardDescription>Your scheduled future communications</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold mb-2">{analytics.timelessMessages}</div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{analytics.quotas.timeless - analytics.timelessMessages}</span> messages remaining out of <span className="font-medium">{analytics.quotas.timeless}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Information</CardTitle>
            <CardDescription>Your current plan and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{analytics.subscription.plan} Plan</h3>
                <p className="text-muted-foreground">Active until {new Date(analytics.subscription.expiry).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="text-primary hover:underline">Manage Subscription</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
