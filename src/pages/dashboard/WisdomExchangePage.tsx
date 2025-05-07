
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare, User, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const WisdomExchangePage: React.FC = () => {
  // Mock data for wisdom posts and mentors
  const wisdomPosts = [
    {
      id: 1,
      title: "Finding Work-Life Balance",
      content: "After 20 years in the tech industry, I've found these strategies to be most effective...",
      author: "David Miller",
      authorRole: "Career Mentor",
      date: "2023-12-02",
      likes: 78,
      comments: 23,
      category: "Career"
    },
    {
      id: 2,
      title: "Investment Strategies for Beginners",
      content: "If you're just starting your investment journey, here are the key principles to follow...",
      author: "Sarah Chen",
      authorRole: "Finance Mentor",
      date: "2023-11-28",
      likes: 112,
      comments: 45,
      category: "Finance"
    }
  ];

  const mentors = [
    {
      id: 1,
      name: "David Miller",
      role: "Career Mentor",
      expertise: "Technology, Leadership, Work-Life Balance",
      followers: 1243,
      bio: "20+ years in tech leadership, helping professionals navigate career transitions.",
      isFollowing: true
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Finance Mentor",
      expertise: "Investments, Personal Finance, Retirement Planning",
      followers: 2567,
      bio: "Former investment banker with a passion for helping others achieve financial freedom.",
      isFollowing: false
    },
    {
      id: 3,
      name: "Robert Jackson",
      role: "Life Mentor",
      expertise: "Relationships, Personal Growth, Mindfulness",
      followers: 1892,
      bio: "Dedicated to helping people live more fulfilling lives through mindfulness and purpose.",
      isFollowing: false
    }
  ];

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
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Wisdom Exchange</h1>
        <p className="text-muted-foreground mt-2">
          Connect with mentors and discover valuable insights
        </p>
      </motion.div>

      <Tabs defaultValue="feed" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {wisdomPosts.map(post => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                          By {post.author} • {post.authorRole} • {new Date(post.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="bg-secondary/50 px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="mentors">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors by name or expertise..."
                className="pl-10"
              />
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {mentors.map(mentor => (
              <motion.div key={mentor.id} variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div>
                          <CardTitle>{mentor.name}</CardTitle>
                          <CardDescription>{mentor.role}</CardDescription>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={mentor.isFollowing ? "outline" : "default"}
                        className="flex items-center gap-1"
                      >
                        {mentor.isFollowing ? (
                          "Following"
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{mentor.bio}</p>
                    <div className="bg-secondary/50 p-3 rounded-md">
                      <p className="text-xs font-medium mb-2">EXPERTISE</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.split(', ').map(skill => (
                          <span key={skill} className="text-xs bg-background px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    {mentor.followers.toLocaleString()} followers
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="following">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {mentors.filter(mentor => mentor.isFollowing).map(mentor => (
              <motion.div key={mentor.id} variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div>
                          <CardTitle>{mentor.name}</CardTitle>
                          <CardDescription>{mentor.role}</CardDescription>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        Following
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{mentor.bio}</p>
                    <div className="bg-secondary/50 p-3 rounded-md">
                      <p className="text-xs font-medium mb-2">EXPERTISE</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.split(', ').map(skill => (
                          <span key={skill} className="text-xs bg-background px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{mentor.followers.toLocaleString()} followers</span>
                    <Button size="sm">View Posts</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {mentors.filter(mentor => mentor.isFollowing).length === 0 && (
              <motion.div variants={itemVariants} className="col-span-2">
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-medium mb-2">You're not following any mentors yet</h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">
                      Find and follow mentors to see their wisdom posts in your feed
                    </p>
                    <Button>Find Mentors</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WisdomExchangePage;
