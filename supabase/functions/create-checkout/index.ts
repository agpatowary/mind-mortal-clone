
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Get request body
    const { priceId, plan } = await req.json();
    logStep("Request body parsed", { priceId, plan });

    if (!priceId && !plan) {
      throw new Error("Missing priceId or plan parameter");
    }

    // Use service role key for secure operations
    const supabaseAdminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdminClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find or create Stripe customer
    let customerId;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = newCustomer.id;
      logStep("Created new Stripe customer", { customerId });
    }

    // Get actual Stripe priceId if plan name was provided
    let stripePriceId = priceId;
    
    if (!stripePriceId && plan) {
      // Get price based on plan type
      const prices = await stripe.prices.list({
        active: true,
        limit: 100,
      });
      
      let matchingPrice;
      if (plan === 'Monthly') {
        matchingPrice = prices.data.find(p => p.unit_amount === 399 && p.recurring?.interval === 'month');
      } else if (plan === 'Yearly') {
        matchingPrice = prices.data.find(p => p.unit_amount === 2999 && p.recurring?.interval === 'year');
      } else if (plan === 'Lifetime') {
        matchingPrice = prices.data.find(p => p.unit_amount === 8900 && !p.recurring);
      }
      
      if (!matchingPrice) {
        throw new Error(`No matching price found for plan: ${plan}`);
      }
      
      stripePriceId = matchingPrice.id;
      logStep("Found matching price for plan", { plan, stripePriceId });
    }

    // Determine if this is a recurring subscription or one-time payment
    const price = await stripe.prices.retrieve(stripePriceId);
    const isSubscription = price.recurring !== null;
    logStep("Price retrieved", { isSubscription, price });

    // Create checkout session parameters
    const params: any = {
      customer: customerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: `${req.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
    };

    // Create checkout session
    const session = await stripe.checkout.sessions.create(params);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Return checkout URL
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
