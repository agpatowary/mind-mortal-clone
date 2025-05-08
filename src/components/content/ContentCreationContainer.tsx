
import React, { useState, useEffect } from 'react';
import LegacyVaultForm from './LegacyVaultForm';
import WisdomExchangeForm from './WisdomExchangeForm';
import TimelessMessagesForm from './TimelessMessagesForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for route information
type RouteInfo = {
  pathname: string;
};

const ContentCreationContainer: React.FC<{ 
  initialTab?: string;
  routeInfo?: RouteInfo;
}> = ({ initialTab, routeInfo }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || "legacy-vault");
  
  // Set initial tab based on props or URL path if available
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (routeInfo && routeInfo.pathname) {
      if (routeInfo.pathname.includes('legacy-vault')) {
        setActiveTab('legacy-vault');
      } else if (routeInfo.pathname.includes('wisdom-exchange')) {
        setActiveTab('wisdom-exchange');
      } else if (routeInfo.pathname.includes('timeless-messages')) {
        setActiveTab('timeless-messages');
      }
    }
  }, [initialTab, routeInfo]);

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="legacy-vault">Legacy Vault</TabsTrigger>
          <TabsTrigger value="wisdom-exchange">Wisdom Exchange</TabsTrigger>
          <TabsTrigger value="timeless-messages">Timeless Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="legacy-vault" className="mt-6">
          <LegacyVaultForm />
        </TabsContent>
        
        <TabsContent value="wisdom-exchange" className="mt-6">
          <WisdomExchangeForm />
        </TabsContent>
        
        <TabsContent value="timeless-messages" className="mt-6">
          <TimelessMessagesForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreationContainer;
