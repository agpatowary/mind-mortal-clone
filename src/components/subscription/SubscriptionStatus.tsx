
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionStatusProps {
  showPlans?: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ showPlans = false }) => {
  const { user } = useAuth();
  const { subscription, isLoading, error } = useSubscription();
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const navigate = useNavigate();

  // Fetch available plans if showPlans is true
  useEffect(() => {
    if (showPlans) {
      const fetchPlans = async () => {
        setLoadingPlans(true);
        try {
          const { data, error } = await supabase
            .rpc('get_public_plan_configurations');
            
          if (error) throw error;
          
          setPlans(data || []);
        } catch (error) {
          console.error('Error fetching plans:', error);
        } finally {
          setLoadingPlans(false);
        }
      };
      
      fetchPlans();
    }
  }, [showPlans]);

  if (isLoading) {
    return (
      <div className="bg-muted/20 rounded-md p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading your subscription information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 rounded-md p-6">
        <p className="text-destructive font-medium">Error loading subscription</p>
        <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
      </div>
    );
  }

  // Current subscription display
  const subscriptionDisplay = (
    <div className="bg-muted/20 rounded-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{subscription?.tier || "Free Plan"}</h3>
            {subscription?.active && (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                Active
              </Badge>
            )}
            {!subscription?.active && subscription?.tier && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                Expired
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {subscription?.tier 
              ? `Your subscription ${subscription.active ? "is active" : "has expired"}`
              : "You are currently on the free plan"}
          </p>
          {subscription?.endDate && (
            <p className="text-xs text-muted-foreground mt-1">
              {subscription.active
                ? `Renews on ${new Date(subscription.endDate).toLocaleDateString()}`
                : `Expired on ${new Date(subscription.endDate).toLocaleDateString()}`}
            </p>
          )}
        </div>
        {showPlans && (
          <Button
            variant="outline"
            onClick={() => navigate('/pricing')}
          >
            {subscription?.tier ? "Change Plan" : "Upgrade"}
          </Button>
        )}
      </div>
    </div>
  );

  // Show only current subscription if not showing plans
  if (!showPlans) {
    return subscriptionDisplay;
  }

  // Show current subscription and available plans
  return (
    <div className="space-y-6">
      {subscriptionDisplay}
      
      <h3 className="text-xl font-semibold mt-6">Available Plans</h3>
      
      {loadingPlans ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.is_popular ? "border-primary" : ""}>
              {plan.is_popular && (
                <Badge className="absolute -top-2 right-4">Popular</Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    ${plan.monthly_price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={subscription?.plan_id === plan.plan_id ? "outline" : "default"}
                  disabled={subscription?.plan_id === plan.plan_id}
                >
                  {subscription?.plan_id === plan.plan_id ? "Current Plan" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
