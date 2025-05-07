
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LegacyVaultForm from './LegacyVaultForm';
import WisdomExchangeForm from './WisdomExchangeForm';
import TimelessMessagesForm from './TimelessMessagesForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContentCreationContainer: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("legacy-vault");
  
  // Set initial tab based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('legacy-vault')) {
      setActiveTab('legacy-vault');
    } else if (path.includes('wisdom-exchange')) {
      setActiveTab('wisdom-exchange');
    } else if (path.includes('timeless-messages')) {
      setActiveTab('timeless-messages');
    }
  }, [location]);

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
