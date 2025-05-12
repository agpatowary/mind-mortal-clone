
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';

const SubscriptionStatus = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    isLoading, 
    error, 
    checkSubscription,
    openCustomerPortal
  } = useSubscription();
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>View and manage your subscription</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-destructive p-4 rounded bg-destructive/10">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">Status:</p>
              <p>{subscribed ? 'Active' : 'Inactive'}</p>
            </div>
            
            {subscription_tier && (
              <div>
                <p className="font-medium">Plan:</p>
                <p>{subscription_tier}</p>
              </div>
            )}
            
            {subscription_end && (
              <div>
                <p className="font-medium">Renews on:</p>
                <p>{new Date(subscription_end).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={checkSubscription} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Refresh Status
        </Button>
        
        {subscribed && (
          <Button onClick={openCustomerPortal} disabled={isLoading}>
            Manage Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionStatus;
