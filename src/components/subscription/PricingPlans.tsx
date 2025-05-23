
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";

interface PricingPlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  planType: 'Monthly' | 'Yearly' | 'Lifetime';
  disabled?: boolean;
  current?: boolean;
}

const PricingPlan = ({
  title,
  price,
  description,
  features,
  popular = false,
  buttonText,
  planType,
  disabled = false,
  current = false
}: PricingPlanProps) => {
  const { createCheckout, subscriptionData, isLoading } = useSubscription();

  const handleSubscribe = () => {
    createCheckout(planType);
  };

  return (
    <Card className={`w-full ${popular ? 'border-primary shadow-lg' : ''} ${current ? 'bg-primary/5' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0 rounded-bl rounded-tr px-3 py-1 text-xs font-medium bg-primary text-primary-foreground">
          Popular
        </div>
      )}
      {current && (
        <div className="absolute top-0 left-0 rounded-br rounded-tl px-3 py-1 text-xs font-medium bg-green-500 text-white">
          Current Plan
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-bold">{price}</span>
          {planType !== 'Lifetime' && <span className="ml-1 text-muted-foreground">{planType === 'Monthly' ? '/month' : '/year'}</span>}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={popular ? "default" : "outline"}
          disabled={current || disabled || isLoading}
          onClick={handleSubscribe}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : current ? (
            "Current Plan"
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PricingPlans = () => {
  const { subscriptionData, isLoading, openCustomerPortal } = useSubscription();

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Subscription Plans</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for you and your legacy needs.
        </p>
        {subscriptionData.subscription_tier && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={openCustomerPortal}
          >
            Manage Current Subscription
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PricingPlan
          title="Monthly"
          price="$3.99"
          description="The first step"
          planType="Monthly"
          buttonText="Subscribe Monthly"
          current={subscriptionData.subscription_tier === 'Monthly'}
          disabled={isLoading}
          features={[
            "Access to Legacy Vault",
            "Basic access to the Mentor Marketplace",
            "Community Access",
            "Limited interaction within community forums"
          ]}
        />
        <PricingPlan
          title="Yearly"
          price="$29.99"
          description="Moment of Impact"
          planType="Yearly"
          buttonText="Subscribe Yearly"
          popular={true}
          current={subscriptionData.subscription_tier === 'Yearly'}
          disabled={isLoading}
          features={[
            "Advanced Legacy Vault",
            "Full access to Mentor Marketplace",
            "Timeless messaging",
            "Enhanced storage options and privacy controls"
          ]}
        />
        <PricingPlan
          title="Lifetime"
          price="$89"
          description="Immortal"
          planType="Lifetime"
          buttonText="Get Lifetime Access"
          current={subscriptionData.subscription_tier === 'Lifetime'}
          disabled={isLoading}
          features={[
            "Unlimited Legacy Vault storage",
            "Premium Support",
            "Priority Timeless Message Creation",
            "Exclusive Access to Masterclasses"
          ]}
        />
      </div>
    </div>
  );
};

export default PricingPlans;
