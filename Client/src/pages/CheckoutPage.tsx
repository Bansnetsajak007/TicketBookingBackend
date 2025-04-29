
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getEventById, Event } from '@/services/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

// Define form schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  paymentMethod: z.enum(['esewa', 'khalti']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();
  const quantity = Number(searchParams.get('quantity')) || 1;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      paymentMethod: 'esewa',
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        if (eventId) {
          const eventData = getEventById(eventId);
          if (eventData) {
            setEvent(eventData);
          } else {
            toast.error('Event not found');
            navigate('/events');
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 90% chance of success
      const isSuccessful = Math.random() < 0.9;
      
      if (isSuccessful) {
        setIsSuccess(true);
        toast.success('Payment successful!');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate prices
  const subtotal = event ? event.price * quantity : 0;
  const serviceFee = subtotal * 0.10;
  const total = subtotal + serviceFee;

  // Submit handler
  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Form data:', data);
    setShowPaymentDialog(true);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading checkout...</div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/events')}>Browse Events</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md bg-card rounded-lg border border-border p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Booking Confirmed!</h2>
            <p className="mt-2 text-muted-foreground">
              Your tickets have been booked successfully for {event.title}.
            </p>
            <div className="mt-6">
              <h3 className="font-semibold">Booking Details</h3>
              <div className="mt-2 border border-border rounded-md p-4 bg-muted/30">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Event:</span>
                  <span>{event.title}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-border">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{event.date}, {event.time}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-border">
                  <span className="text-muted-foreground">Venue:</span>
                  <span>{event.venue}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-border">
                  <span className="text-muted-foreground">Tickets:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-border font-semibold">
                  <span>Total Paid:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-4">
                A confirmation email has been sent to your email address. You can also view your tickets in your account.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/')}>
                  Return to Home
                </Button>
                <Button variant="outline" onClick={() => navigate('/events')}>
                  Browse More Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-card rounded-lg border border-border p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="esewa" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <div className="bg-white text-black text-xs px-2 py-1 rounded mr-2">eSewa</div>
                                Pay with eSewa digital wallet
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="khalti" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <div className="bg-white text-black text-xs px-2 py-1 rounded mr-2">Khalti</div>
                                Pay with Khalti digital wallet
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Complete Purchase
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.date}, {event.time}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Quantity:</span>
                    <span>{quantity} ticket{quantity > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price per ticket:</span>
                    <span>${event.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Processing Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isProcessing ? 'Processing Payment' : 'Confirm Payment'}
            </DialogTitle>
            <DialogDescription>
              {isProcessing
                ? 'Please wait while we process your payment...'
                : `Complete your payment of $${total.toFixed(2)} using ${
                    form.getValues('paymentMethod') === 'esewa' ? 'eSewa' : 'Khalti'
                  }`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
                <p className="text-center text-muted-foreground">
                  Connecting to payment gateway...
                </p>
              </div>
            ) : (
              <div className="py-4">
                <div className="bg-muted/50 border border-border p-4 rounded mb-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    This is a mock payment process for demonstration
                  </p>
                  <p className="font-medium">
                    Total: ${total.toFixed(2)}
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                >
                  Confirm & Pay
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CheckoutPage;
