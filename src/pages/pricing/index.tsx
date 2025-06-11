
import React from 'react';
import PricingPlans from '@/components/subscription/PricingPlans';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Legacy Plan</h1>
          <p className="text-lg text-muted-foreground">
            Invest in preserving your wisdom, ideas, and legacy for future generations.
          </p>
        </div>
        
        <PricingPlans />
        
        <div className="max-w-3xl mx-auto mt-16 p-6 border rounded-lg bg-background">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Can I switch between plans?</h4>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect at the start of your next billing cycle.</p>
            </div>
            
            <div>
              <h4 className="font-medium">What happens to my content if I cancel?</h4>
              <p className="text-muted-foreground">Your content remains accessible according to your previous plan for 30 days after cancellation. After that, you'll retain basic access but may lose premium features.</p>
            </div>
            
            <div>
              <h4 className="font-medium">Is the Lifetime plan really forever?</h4>
              <p className="text-muted-foreground">Yes, the Lifetime plan provides permanent access to all features as specified, for the lifetime of the service.</p>
            </div>
            
            <div>
              <h4 className="font-medium">How secure is my payment information?</h4>
              <p className="text-muted-foreground">All payments are processed securely through Stripe. We never store your credit card information on our servers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
