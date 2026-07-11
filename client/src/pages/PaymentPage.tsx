import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { CreditCard, Lock, CheckCircle, Zap, Shield, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";

const PLANS = [
  { id: "monthly", label: "Monthly", price: 9.99,  period: "/month",  paddle: "pri_monthly", paypal: "P-MONTHLY"  },
  { id: "yearly",  label: "Yearly",  price: 79.99, period: "/year",   paddle: "pri_yearly",  paypal: "P-YEARLY",  badge: "Save 33%" },
];

export function PaymentPage() {
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [couponCode,   setCouponCode]   = useState("");
  const [appliedCoupon, setApplied]     = useState<any>(null);
  const [couponLoading, setCouponLoad]  = useState(false);

  const applyCouponMutation = trpc.stripe.applyCoupon.useMutation();

  const plan      = PLANS.find(p => p.id === selectedPlan)!;
  const finalPrice = appliedCoupon
    ? (plan.price * (1 - appliedCoupon.discount / 100)).toFixed(2)
    : plan.price.toFixed(2);

  /* ── coupon ── */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoad(true);
    try {
      const result = await applyCouponMutation.mutateAsync({ code: couponCode, amount: plan.price });
      setApplied(result);
      toast.success(`Coupon applied — ${result.discount}% off!`);
    } catch {
      toast.error("Invalid coupon code. Try WELCOME10 or SUMMER20");
    } finally { setCouponLoad(false); }
  };

  /* ── Stripe checkout ── */
  const stripeCheckout = trpc.stripe.createSubscription.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to Stripe checkout…");
        window.location.href = data.checkoutUrl;
      }
    },
    onError: () => toast.error("Stripe checkout failed. Please try again."),
  });

  const handleStripe = () => {
    stripeCheckout.mutate({ plan: "pro", origin: window.location.origin });
  };

  /* ── Paddle checkout ── */
  const handlePaddle = () => {
    const env = (window as any).__PADDLE_ENV__ || "sandbox";
    const isConfigured = !!(window as any).Paddle;
    if (isConfigured) {
      (window as any).Paddle.Checkout.open({
        product: plan.paddle,
        email: "",
        passthrough: JSON.stringify({ plan: selectedPlan }),
        successCallback: () => { toast.success("Payment successful!"); navigate("/success"); },
        closeCallback:   () => toast.info("Checkout closed"),
      });
    } else {
      // Paddle not loaded — show config info
      toast.info("Paddle requires PADDLE_VENDOR_ID in your .env and the Paddle.js script. See DEPLOYMENT.md.");
    }
  };

  /* ── PayPal checkout ── */
  const handlePayPal = () => {
    const clientId = (window as any).__PAYPAL_CLIENT_ID__;
    if (clientId) {
      const returnUrl = encodeURIComponent(`${window.location.origin}/success`);
      const cancelUrl = encodeURIComponent(`${window.location.origin}/payment`);
      const paypalUrl = `https://www.paypal.com/webapps/billing/plans/subscribe`
        + `?plan_id=${plan.paypal}&return_url=${returnUrl}&cancel_url=${cancelUrl}`;
      window.location.href = paypalUrl;
    } else {
      toast.info("PayPal requires PAYPAL_CLIENT_ID in your .env. See DEPLOYMENT.md.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-2 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Upgrade to Premium</h1>
          <p className="text-slate-600 mt-1">Unlock all courses, AI tutor, and certificates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Plan + Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Plan selector */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Choose your plan</h2>
              <div className="grid grid-cols-2 gap-4">
                {PLANS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPlan(p.id as any); setApplied(null); setCouponCode(""); }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      selectedPlan === p.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-2 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                    <p className="font-semibold text-slate-800">{p.label}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">${p.price}<span className="text-sm font-normal text-slate-500">{p.period}</span></p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Coupon */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-800 mb-3">Promo Code</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                />
                <Button variant="outline" onClick={handleApplyCoupon} disabled={!!appliedCoupon || couponLoading}>
                  {couponLoading ? "…" : "Apply"}
                </Button>
                {appliedCoupon && (
                  <Button variant="ghost" size="sm" onClick={() => { setApplied(null); setCouponCode(""); }}>
                    Remove
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  ✓ {appliedCoupon.discount}% discount applied
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">Try: WELCOME10 · SUMMER20 · REFERRAL15</p>
            </Card>

            {/* Payment methods */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Pay with</h2>
              <Tabs defaultValue="stripe">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="stripe"  className="gap-2"><CreditCard className="w-4 h-4" />Card / Stripe</TabsTrigger>
                  <TabsTrigger value="paddle"  className="gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                    Paddle
                  </TabsTrigger>
                  <TabsTrigger value="paypal"  className="gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#003087"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.379 3.195.842 6.507-1.524 8.528a6.532 6.532 0 0 1-.978.67l.042-.245C19.945 11.247 21.076 9.168 21.222 6.917z"/></svg>
                    PayPal
                  </TabsTrigger>
                </TabsList>

                {/* Stripe */}
                <TabsContent value="stripe" className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 flex items-start gap-3">
                    <Lock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>You'll be securely redirected to Stripe's checkout page. We never store your card details.</span>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base gap-2"
                    onClick={handleStripe}
                    disabled={stripeCheckout.isPending}
                  >
                    <CreditCard className="w-5 h-5" />
                    {stripeCheckout.isPending ? "Connecting…" : `Pay $${finalPrice} with Stripe`}
                  </Button>
                  <p className="text-xs text-center text-slate-400">Visa · Mastercard · Amex · Apple Pay · Google Pay</p>
                </TabsContent>

                {/* Paddle */}
                <TabsContent value="paddle" className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">💡 About Paddle</p>
                    <p>Paddle is a Merchant of Record — they handle tax, VAT, and compliance for you automatically in 200+ countries.</p>
                  </div>
                  <Button
                    className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-6 text-base gap-2"
                    onClick={handlePaddle}
                  >
                    <ExternalLink className="w-5 h-5" />
                    {`Pay $${finalPrice} with Paddle`}
                  </Button>
                  <p className="text-xs text-center text-slate-400">Requires PADDLE_VENDOR_ID in .env to activate</p>
                </TabsContent>

                {/* PayPal */}
                <TabsContent value="paypal" className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                    <p className="font-medium mb-1">PayPal Subscriptions</p>
                    <p>You'll be redirected to PayPal to authorise the recurring subscription. Cancel any time from your PayPal account.</p>
                  </div>
                  <Button
                    className="w-full bg-[#003087] hover:bg-[#001f5c] text-white py-6 text-base gap-2"
                    onClick={handlePayPal}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                    {`Pay $${finalPrice} with PayPal`}
                  </Button>
                  <p className="text-xs text-center text-slate-400">Requires PAYPAL_CLIENT_ID in .env to activate</p>
                </TabsContent>
              </Tabs>
            </Card>

          </div>

          {/* Right — Order summary */}
          <div>
            <Card className="p-6 sticky top-6">
              <h3 className="font-semibold text-slate-800 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-slate-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Premium {plan.label}</span>
                  <span className="font-medium">${plan.price}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.discount}%)</span>
                    <span>-${(plan.price * appliedCoupon.discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Tax</span><span>$0.00</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">${finalPrice}</span>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-800 mb-2">What you get:</p>
                {[
                  "All courses & languages",
                  "Unlimited exercises",
                  "AI tutor assistance",
                  "Certificates",
                  "Priority support",
                  "Cancel anytime",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-slate-50 rounded-lg flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4 flex-shrink-0" />
                7-day money-back guarantee
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
