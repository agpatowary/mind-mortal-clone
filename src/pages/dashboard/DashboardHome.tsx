
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, FileText, Lightbulb, Clock, BookOpen, Users, Heart, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleCreateClick = (type: string) => {
    switch (type) {
      case 'legacy':
        navigate('/dashboard/legacy-vault/create');
        break;
      case 'idea':
        navigate('/dashboard/idea-vault/create');
        break;
      case 'message':
        navigate('/dashboard/timeless-messages/create');
        break;
      case 'resource':
        navigate('/dashboard/mentorship/create');
        break;
      default:
        break;
    }
  };

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
    <div className="container mx-auto max-w-6xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your journey to immortality begins here. Create, share, and preserve your legacy.
          </p>
          
          {/* Create Content Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="lg" className="text-lg px-8 py-6">
                <Plus className="mr-2 h-5 w-5" />
                Create Content
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem onClick={() => handleCreateClick('legacy')}>
                <FileText className="mr-2 h-4 w-4" />
                Legacy Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateClick('idea')}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Idea Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateClick('message')}>
                <Clock className="mr-2 h-4 w-4" />
                Timeless Message
              </DropdownMenuItem>
              {profile?.is_mentor && (
                <DropdownMenuItem onClick={() => handleCreateClick('resource')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Mentorship Resource
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Legacy Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Stories for the future
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ideas Shared</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Innovations documented
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Impact</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Lives touched
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Scheduled</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Future connections
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/dashboard/legacy-vault')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Legacy Vault
                </CardTitle>
                <CardDescription>
                  Preserve your memories and stories for future generations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/dashboard/idea-vault')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Idea Vault
                </CardTitle>
                <CardDescription>
                  Document and refine your innovative ideas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/dashboard/mentorship')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Mentorship
                </CardTitle>
                <CardDescription>
                  {profile?.is_mentor ? 'Share your knowledge and experience' : 'Connect with mentors and learn'}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/dashboard/timeless-messages')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Timeless Messages
                </CardTitle>
                <CardDescription>
                  Schedule messages for future delivery
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
