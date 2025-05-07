
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, MessageSquare, Share2, Search, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder data
const mockWisdomPosts = [
  {
    id: '1',
    title: 'Finding Your Career Path',
    content: 'The key to a fulfilling career is to focus on your strengths rather than trying to fix your weaknesses...',
    category: 'Career',
    createdAt: new Date('2023-06-10'),
    author: {
      id: '101',
      name: 'Dr. Emily Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      expertise: ['Career Development', 'Leadership'],
      followers: 1240
    },
    likes: 89,
    comments: 12
  },
  {
    id: '2',
    title: 'Mindful Investing for the Future',
    content: 'Building wealth is not about making big bets, but about consistent actions over time...',
    category: 'Finance',
    createdAt: new Date('2023-05-22'),
    author: {
      id: '102',
      name: 'Michael Roberts',
      avatar: 'https://i.pravatar.cc/150?img=2',
      expertise: ['Financial Planning', 'Investment'],
      followers: 2310
    },
    likes: 156,
    comments: 24
  },
  {
    id: '3',
    title: 'The Art of Active Listening',
    content: 'The most important skill in any relationship is learning to truly listen...',
    category: 'Relationships',
    createdAt: new Date('2023-06-05'),
    author: {
      id: '103',
      name: 'Dr. Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=3',
      expertise: ['Psychology', 'Relationship Counseling'],
      followers: 1875
    },
    likes: 210,
    comments: 37
  }
];

const mockMentors = [
  {
    id: '101',
    name: 'Dr. Emily Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    expertise: ['Career Development', 'Leadership'],
    bio: 'Former HR executive with 20+ years of experience helping professionals find their path.',
    followers: 1240,
    isFollowing: true
  },
  {
    id: '102',
    name: 'Michael Roberts',
    avatar: 'https://i.pravatar.cc/150?img=2',
    expertise: ['Financial Planning', 'Investment'],
    bio: 'Certified financial planner with a passion for teaching financial literacy.',
    followers: 2310,
    isFollowing: true
  },
  {
    id: '103',
    name: 'Dr. Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=3',
    expertise: ['Psychology', 'Relationship Counseling'],
    bio: 'Clinical psychologist specializing in communication and relationship dynamics.',
    followers: 1875,
    isFollowing: false
  },
  {
    id: '104',
    name: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?img=4',
    expertise: ['Health & Wellness', 'Nutrition'],
    bio: 'Nutritionist and wellness coach with a holistic approach to health.',
    followers: 935,
    isFollowing: false
  }
];

const categories = [
  'All', 'Career', 'Finance', 'Health', 'Relationships', 
  'Parenting', 'Education', 'Spirituality', 'Life Skills'
];

const WisdomExchange: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPosts = mockWisdomPosts.filter(post => {
    if (activeCategory !== 'All' && post.category !== activeCategory) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  
  const filteredMentors = mockMentors.filter(mentor => {
    if (searchQuery && !mentor.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Wisdom Exchange</h1>
        <p className="text-muted-foreground">
          Connect with mentors and gain insights from their experiences.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for wisdom or mentors..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="feed">Wisdom Feed</TabsTrigger>
            <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          </TabsList>
          
          {activeTab === 'feed' && (
            <Button asChild size="sm">
              <Link to="/dashboard/create?type=wisdom">
                <Plus className="w-4 h-4 mr-1" />
                Share Wisdom
              </Link>
            </Button>
          )}
        </div>
        
        <div className="my-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge 
              key={category} 
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <TabsContent value="feed" className="mt-0">
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No wisdom posts found.</p>
              <Button asChild>
                <Link to="/dashboard/create?type=wisdom">Share Your First Wisdom</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {post.author.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {post.author.expertise.join(' • ')}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge>{post.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between py-3 text-sm text-muted-foreground">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="px-2">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="px-2">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>{post.comments}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="px-2">
                      <Share2 className="w-4 h-4 mr-1" />
                      <span>Share</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="mentors" className="mt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMentors.map(mentor => (
              <Card key={mentor.id}>
                <CardHeader className="pb-3">
                  <div className="flex space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {mentor.followers} followers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mentor.expertise.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mentor.bio}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={mentor.isFollowing ? "outline" : "default"} 
                    className="w-full"
                  >
                    {mentor.isFollowing ? "Following" : "Follow"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredMentors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No mentors found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WisdomExchange;
