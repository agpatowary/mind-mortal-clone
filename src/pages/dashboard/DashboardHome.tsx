
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Archive, Clock, MessageSquare, Users, PlusCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FeatureCard = ({ icon, title, description, to }: { icon: React.ReactNode, title: string, description: string, to: string }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1)' }}
    transition={{ duration: 0.2 }}
  >
    <Link to={to}>
      <Card className="h-full hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

const DashboardHome = () => {
  const { user, profile } = useAuth();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!</h1>
          <p className="text-muted-foreground">
            What would you like to do today?
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>What would you like to create?</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/legacy-vault/create">
                  <Archive className="h-4 w-4 mr-2" /> Legacy Post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/timeless-messages/create">
                  <Clock className="h-4 w-4 mr-2" /> Timeless Message
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/wisdom-exchange/create">
                  <Users className="h-4 w-4 mr-2" /> Wisdom Exchange
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/idea-vault/create">
                  <Lightbulb className="h-4 w-4 mr-2" /> Idea
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<Archive className="h-6 w-6 text-primary" />}
              title="Legacy Vault"
              description="Start or continue documenting your legacy for future generations."
              to="/dashboard/legacy-vault"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<Lightbulb className="h-6 w-6 text-primary" />}
              title="Idea Vault"
              description="Document and develop your innovative ideas."
              to="/dashboard/idea-vault"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Mentorship"
              description="Share your knowledge or connect with mentors."
              to="/dashboard/mentorship"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<Clock className="h-6 w-6 text-primary" />}
              title="Timeless Messages"
              description="Create messages to be delivered in the future."
              to="/dashboard/timeless-messages"
            />
          </motion.div>
        </div>
        
        <motion.div variants={itemVariants} className="mt-8">
          <SubscriptionStatus />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
