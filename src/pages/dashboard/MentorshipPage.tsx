
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, BookOpen, Calendar } from 'lucide-react';

const MentorshipPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
          <p className="text-muted-foreground mt-1">Exchange wisdom, find mentors, grow together</p>
        </div>
        <Button onClick={() => navigate('/dashboard/mentorship/create')} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Create Resource
        </Button>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resources">My Resources</TabsTrigger>
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="groups">Group Circles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Getting Started with React</CardTitle>
                  <CardDescription>My journey into modern web development</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Shared resources: 3</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Created: April 15, 2023</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                  <Button variant="ghost" size="sm" className="ml-auto">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mentors">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>Mentor Name {i}</CardTitle>
                      <CardDescription>Tech Leadership • 15 yrs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Specializes in product strategy, team growth, and technical architecture for scaling startups.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Profile</Button>
                  <Button size="sm">Connect</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="groups">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Group Circle {i}</CardTitle>
                  <CardDescription>AI Ethics & Future Technology</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm mb-2">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Members: {i * 12}</span>
                  </div>
                  <p className="text-sm">A group focused on discussing the ethical implications of AI advancements and how they shape our future.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Join Circle</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorshipPage;
