
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Clock, MapPin } from 'lucide-react';

const LegacyVaultPage: React.FC = () => {
  // Mock data for legacy posts
  const posts = [
    {
      id: 1,
      title: "My Career Journey",
      content: "I started as a junior developer in 2005. Little did I know where this path would lead me...",
      author: "John Doe",
      date: "2023-11-12",
      likes: 24,
      comments: 5,
      type: "public"
    },
    {
      id: 2,
      title: "Advice for My Children",
      content: "Life is full of challenges, but remember these three principles...",
      author: "Jane Smith",
      date: "2023-10-25",
      likes: 45,
      comments: 12,
      type: "public"
    },
    {
      id: 3,
      title: "Time Capsule for 2030",
      content: "When you read this, I hope the world has changed for the better...",
      author: "Alex Johnson",
      date: "2023-09-18",
      revealDate: "2030-01-01",
      type: "timeCapsule"
    },
    {
      id: 4,
      title: "Message at Central Park",
      content: "I proposed to my wife here 20 years ago. The memory is still vivid...",
      author: "Michael Brown",
      date: "2023-08-30",
      location: "Central Park, New York",
      type: "location"
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
        <h1 className="text-3xl font-bold">Legacy Vault</h1>
        <p className="text-muted-foreground mt-2">
          Browse and interact with legacy posts
        </p>
      </motion.div>

      <Tabs defaultValue="public" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="public">Public Gallery</TabsTrigger>
          <TabsTrigger value="timeCapsule">Time Capsule</TabsTrigger>
          <TabsTrigger value="location">Location-Based</TabsTrigger>
        </TabsList>

        <TabsContent value="public">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {posts.filter(post => post.type === "public").map(post => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>By {post.author} • {new Date(post.date).toLocaleDateString()}</CardDescription>
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

        <TabsContent value="timeCapsule">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {posts.filter(post => post.type === "timeCapsule").map(post => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      By {post.author} • Created on {new Date(post.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/50 p-4 rounded-md mb-4">
                      <p className="font-medium">Will be revealed on: {new Date(post.revealDate).toLocaleDateString()}</p>
                    </div>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="ml-auto">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="location">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {posts.filter(post => post.type === "location").map(post => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-red-500" />
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      By {post.author} • Created on {new Date(post.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/50 p-4 rounded-md mb-4">
                      <p className="font-medium">Location: {post.location}</p>
                    </div>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>Like</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Comment</span>
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      View on Map
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegacyVaultPage;
