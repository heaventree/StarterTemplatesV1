import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Template } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

function CheckoutForm({ template, amount }: { template: Template, amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    try {
      // Call your backend to create the PaymentIntent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          templateId: template.id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Use the client secret to confirm the payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Template Customer',
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        toast({
          title: 'Payment successful!',
          description: `Thank you for purchasing ${template.title}`,
        });
        
        // After payment success, navigate to download page after 2 seconds
        setTimeout(() => {
          navigate(`/download?template=${template.id}&purchase=true`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Payment failed',
        description: err.message,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {succeeded ? (
        <div className="flex flex-col items-center justify-center py-4">
          <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
          <h3 className="text-xl font-semibold">Payment Successful!</h3>
          <p className="text-muted-foreground mb-4">Thank you for your purchase.</p>
          <p className="text-sm">Redirecting to download page...</p>
        </div>
      ) : (
        <>
          <div className="p-4 border rounded-md bg-muted/30">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              `Pay $${(amount / 100).toFixed(2)}`
            )}
          </Button>
        </>
      )}
    </form>
  );
}

export default function Checkout() {
  const [location] = useLocation();
  const [templateId, setTemplateId] = useState<number | null>(null);
  
  // Extract templateId from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('template');
    if (id) {
      setTemplateId(parseInt(id, 10));
    }
  }, [location]);
  
  // Fetch template details
  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['/api/templates', templateId],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) {
        throw new Error('Template not found');
      }
      return response.json() as Promise<Template>;
    },
    enabled: !!templateId,
  });
  
  // Calculate price based on template.isPro
  const price = template?.isPro ? 4900 : 0; // $49.00 in cents
  
  // Function to go back
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="container max-w-xl py-8">
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            Secure payment processing with Stripe
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoadingTemplate ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : template ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {template.imageUrl && (
                  <div className="shrink-0 w-20 h-20 rounded overflow-hidden border">
                    <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">{template.pageBuilder} Template</p>
                  {template.isPro && (
                    <div className="mt-1">
                      <span className="inline-block text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded">
                        PRO
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-auto text-right">
                  <span className="font-bold text-lg">${(price/100).toFixed(2)}</span>
                  <p className="text-xs text-muted-foreground">One-time payment</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-4">Payment Information</h4>
                <Elements stripe={stripePromise}>
                  <CheckoutForm template={template} amount={price} />
                </Elements>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">Template not found</p>
              <Button variant="secondary" size="sm" onClick={goBack} className="mt-4">
                Return to templates
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-col items-start border-t pt-4 text-xs text-muted-foreground">
          <p>Your payment is secured with SSL encryption.</p>
          <p className="mt-1">Purchase includes lifetime access to this template.</p>
        </CardFooter>
      </Card>
    </div>
  );
}