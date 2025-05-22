
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { CreditCard, Loader2, CrownIcon } from 'lucide-react';

const SubscriptionStatus = () => {
  const { subscription, isLoading, error, openCustomerPortal } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading your subscription information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-destructive">Error loading subscription: {error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-4">
        <CrownIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <h3 className="font-medium">No Active Subscription</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You're currently on the free tier.
        </p>
        <Button 
          variant="default" 
          size="sm"
          className="w-full"
          onClick={() => window.location.href = '/pricing'}
        >
          View Plans
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-center">
        <Badge className="bg-primary text-primary-foreground mb-2">
          {subscription.tier} Plan
        </Badge>
        <h3 className="font-medium">Active Subscription</h3>
        
        <div className="text-sm text-muted-foreground mt-2">
          <p>Status: <span className="capitalize">{subscription.status}</span></p>
          {subscription.expires_at && (
            <p>Renews: {format(new Date(subscription.expires_at), 'MMM d, yyyy')}</p>
          )}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        className="w-full"
        onClick={openCustomerPortal}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Manage Billing
      </Button>
    </div>
  );
};

export default SubscriptionStatus;
