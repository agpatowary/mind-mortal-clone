
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LegacyVaultForm from './LegacyVaultForm';
import WisdomExchangeForm from './WisdomExchangeForm';
import TimelessMessagesForm from './TimelessMessagesForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContentCreationContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("legacy-vault");
  
  // Safely get location if we're in a Router context
  let locationPathname = '';
  try {
    const location = useLocation();
    locationPathname = location.pathname;
  } catch (error) {
    // If useLocation fails (not in Router context), we'll use default values
    console.log('Router context not available, using default tab');
  }
  
  // Set initial tab based on URL path or state param if available
  useEffect(() => {
    if (locationPathname) {
      if (locationPathname.includes('legacy-vault')) {
        setActiveTab('legacy-vault');
      } else if (locationPathname.includes('wisdom-exchange')) {
        setActiveTab('wisdom-exchange');
      } else if (locationPathname.includes('timeless-messages')) {
        setActiveTab('timeless-messages');
      }
    }
  }, [locationPathname]);

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
