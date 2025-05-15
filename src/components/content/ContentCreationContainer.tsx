import React, { useState, useEffect, ReactNode } from 'react';
import LegacyVaultForm from './LegacyVaultForm';
import WisdomExchangeForm from './WisdomExchangeForm';
import TimelessMessagesForm from './TimelessMessagesForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RouteInfo } from '@/types';

interface ContentCreationContainerProps {
  initialTab?: string;
  routeInfo?: RouteInfo;
  children?: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
}

const ContentCreationContainer: React.FC<ContentCreationContainerProps> = ({ 
  initialTab, 
  routeInfo,
  children,
  title,
  description,
  icon
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || "legacy-vault");
  
  // Set initial tab based on props or URL path if available
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (routeInfo && routeInfo.pathname) {
      if (routeInfo.pathname.includes('legacy-vault')) {
        setActiveTab('legacy-vault');
      } else if (routeInfo.pathname.includes('wisdom-exchange') || routeInfo.pathname.includes('mentorship')) {
        setActiveTab('mentorship');
      } else if (routeInfo.pathname.includes('timeless-messages')) {
        setActiveTab('timeless-messages');
      } else if (routeInfo.pathname.includes('idea-vault')) {
        setActiveTab('idea-vault');
      }
    }
  }, [initialTab, routeInfo]);

  // If children is provided, render it directly without the tabs
  if (children) {
    return (
      <div className="container mx-auto py-6">
        {title && description && (
          <div className="mb-6">
            {icon && <div className="mb-2">{icon}</div>}
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Otherwise, render the tabs
  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="legacy-vault">Legacy Vault</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="timeless-messages">Timeless Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="legacy-vault" className="mt-6">
          <LegacyVaultForm />
        </TabsContent>
        
        <TabsContent value="mentorship" className="mt-6">
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
