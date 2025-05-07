
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Users, Clock } from 'lucide-react';
import LegacyPostForm from './forms/LegacyPostForm';
import WisdomPostForm from './forms/WisdomPostForm';
import TimelessMessageForm from './forms/TimelessMessageForm';

const CreateContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('legacy');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Create Content</h1>
        <p className="text-muted-foreground">
          Share your knowledge, preserve your legacy, or leave timeless messages for loved ones.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="legacy" className="flex items-center">
                <Archive className="mr-2 h-4 w-4" />
                Legacy Post
              </TabsTrigger>
              <TabsTrigger value="wisdom" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Wisdom Post
              </TabsTrigger>
              <TabsTrigger value="timeless" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Timeless Message
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="legacy" className="mt-6">
              <LegacyPostForm />
            </TabsContent>
            
            <TabsContent value="wisdom" className="mt-6">
              <WisdomPostForm />
            </TabsContent>
            
            <TabsContent value="timeless" className="mt-6">
              <TimelessMessageForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateContent;
