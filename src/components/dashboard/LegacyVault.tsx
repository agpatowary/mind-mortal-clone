
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, MessageSquare, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder data
const mockLegacyPosts = [
  {
    id: '1',
    title: 'My Journey Through Europe',
    description: 'I spent three months backpacking through Europe, and these are the lessons I learned...',
    tags: ['Travel', 'Life Lessons', 'Adventure'],
    createdAt: new Date('2023-05-10'),
    author: 'Jane Doe',
    likes: 24,
    comments: 5,
    type: 'public'
  },
  {
    id: '2',
    title: 'Family Recipes Through Generations',
    description: 'A collection of family recipes passed down through four generations...',
    tags: ['Cooking', 'Family', 'Tradition'],
    createdAt: new Date('2023-04-22'),
    author: 'John Smith',
    likes: 42,
    comments: 8,
    type: 'public'
  },
  {
    id: '3',
    title: 'Reflections on Turning 40',
    description: 'As I reach this milestone, here are my thoughts on life so far...',
    tags: ['Reflection', 'Aging', 'Wisdom'],
    createdAt: new Date('2023-06-15'),
    author: 'Alex Johnson',
    likes: 18,
    comments: 3,
    type: 'time-capsule',
    releaseDate: new Date('2023-12-31')
  },
  {
    id: '4',
    title: 'The Hidden Gems of New York',
    description: 'These lesser-known spots in NYC hold special meanings for me...',
    tags: ['New York', 'Travel', 'Personal'],
    createdAt: new Date('2023-03-05'),
    author: 'Sam Wilson',
    likes: 36,
    comments: 12,
    type: 'location-based',
    location: 'New York, NY'
  }
];

const LegacyVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState('public');
  
  const filteredPosts = mockLegacyPosts.filter(post => {
    if (activeTab === 'public') return post.type === 'public';
    if (activeTab === 'time-capsule') return post.type === 'time-capsule';
    if (activeTab === 'location') return post.type === 'location-based';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Legacy Vault</h1>
        <p className="text-muted-foreground">
          Explore and preserve meaningful stories and memories.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="public" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="public">Public Gallery</TabsTrigger>
            <TabsTrigger value="time-capsule">Time Capsule</TabsTrigger>
            <TabsTrigger value="location">Location-Based</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button asChild>
          <Link to="/dashboard/create">Create Legacy</Link>
        </Button>
      </div>

      <TabsContent value={activeTab} className="mt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  By {post.author} • {post.createdAt.toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="line-clamp-3 text-sm text-muted-foreground mb-3">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {post.type === 'time-capsule' && (
                  <div className="flex items-center mt-3 text-sm text-amber-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Reveals on {post.releaseDate?.toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {post.type === 'location-based' && (
                  <div className="flex items-center mt-3 text-sm text-emerald-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{post.location}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {post.comments}
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No legacy posts found in this category.</p>
            <Button asChild>
              <Link to="/dashboard/create">Create Your First Legacy</Link>
            </Button>
          </div>
        )}
      </TabsContent>
    </div>
  );
};

export default LegacyVault;
