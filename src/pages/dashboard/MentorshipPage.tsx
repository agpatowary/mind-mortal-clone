
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Target, Award, Users, BookOpen, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ViewDetailsButton from "@/components/dashboard/ViewDetailsButton";
import { useAuth } from "@/hooks/useAuth";
import GroupCircles from "@/components/wisdom-exchange/GroupCircles";

const MentorshipPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("mentors");
  
  // Mock data - would come from API in real application
  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "Innovation Specialist",
      specialties: ["Technology", "Business Strategy", "Leadership"],
      rating: 4.9,
      reviews: 28,
      students: 47,
      imgUrl: "/lovable-uploads/placeholder.svg",
    },
    {
      id: 2,
      name: "Michael Johnson",
      title: "Entrepreneurship Coach",
      specialties: ["Startups", "Funding", "Product Development"],
      rating: 4.7,
      reviews: 34,
      students: 52,
      imgUrl: "/lovable-uploads/placeholder.svg",
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      title: "Academic Mentor",
      specialties: ["Research", "Publishing", "Higher Education"],
      rating: 4.8,
      reviews: 19,
      students: 31,
      imgUrl: "/lovable-uploads/placeholder.svg",
    }
  ];
  
  const recommendedGroups = [
    {
      id: 1,
      name: "Tech Innovators Circle",
      members: 28,
      topics: ["AI", "Blockchain", "Web3"],
      recentActivity: "5 new discussions today"
    },
    {
      id: 2,
      name: "Creators & Founders",
      members: 42,
      topics: ["Startups", "Creative Process", "Funding"],
      recentActivity: "New meeting scheduled"
    },
    {
      id: 3,
      name: "Legacy Builders",
      members: 19,
      topics: ["Life Stories", "Wisdom", "Mentorship"],
      recentActivity: "3 new resources shared"
    }
  ];
  
  const myResources = [
    {
      id: 1,
      title: "Starting Your First Business",
      type: "Guide",
      views: 124,
      engagement: "High",
      dateCreated: "2023-04-15"
    },
    {
      id: 2,
      title: "Leadership Lessons From My Career",
      type: "Story Collection",
      views: 87,
      engagement: "Medium",
      dateCreated: "2023-03-20"
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
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Knowledge Exchange</h1>
          <p className="text-muted-foreground">Connect with mentors and share wisdom with others.</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate("/dashboard/mentorship/create-resource")}>
            Create Resource
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="groups">Knowledge Groups</TabsTrigger>
          <TabsTrigger value="resources">My Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mentors" className="mt-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mentors.map(mentor => (
              <motion.div key={mentor.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 border">
                        <AvatarImage src={mentor.imgUrl} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <CardDescription>{mentor.title}</CardDescription>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm font-medium mr-1">{mentor.rating}</span>
                          <span className="text-xs text-muted-foreground">({mentor.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {mentor.specialties.map((specialty, i) => (
                        <Badge key={i} variant="secondary" className="font-normal">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{mentor.students} mentees</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <ViewDetailsButton 
                      onClick={() => navigate(`/dashboard/mentorship/mentor/${mentor.id}`)}
                    />
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="groups" className="mt-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {recommendedGroups.map(group => (
              <motion.div key={group.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <CardDescription>{group.members} active members</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-0">
                    <div className="mb-4">
                      <GroupCircles userCount={group.members} size="sm" />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {group.topics.map((topic, i) => (
                        <Badge key={i} variant="outline" className="font-normal">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm flex items-center text-muted-foreground mt-2">
                      <Clock className="h-4 w-4 mr-2" />
                      {group.recentActivity}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button variant="outline" className="w-full">
                      Join Group
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {myResources.length > 0 ? (
              <div className="space-y-4">
                {myResources.map(resource => (
                  <motion.div key={resource.id} variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{resource.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {resource.type}
                            </CardDescription>
                          </div>
                          <Badge>{resource.engagement} Engagement</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{resource.views} Views</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Created {resource.dateCreated}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          Edit Resource
                        </Button>
                        <Button size="sm">
                          View Analytics
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Resources Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Share your knowledge by creating wisdom resources
                </p>
                <Button onClick={() => navigate("/dashboard/mentorship/create-resource")}>
                  Create Your First Resource
                </Button>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorshipPage;
