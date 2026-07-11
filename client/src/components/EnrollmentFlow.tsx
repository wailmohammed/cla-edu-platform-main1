import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface EnrollmentFlowProps {
  courseId: number;
  courseName: string;
  coursePrice: number;
  onEnrollmentComplete?: () => void;
}

export function EnrollmentFlow({ courseId, courseName, coursePrice, onEnrollmentComplete }: EnrollmentFlowProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"confirm" | "payment" | "success" | "error">("confirm");
  const [errorMessage, setErrorMessage] = useState("");

  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  const handleEnroll = async () => {
    if (!user) {
      setErrorMessage("Please log in to enroll in this course");
      setStep("error");
      return;
    }

    try {
      setStep("payment");

      // Create checkout session
      const { checkoutUrl } = await createCheckoutMutation.mutateAsync({
        courseId,
        courseName,
        coursePrice,
        origin: window.location.origin,
      });

      // Open checkout in new tab
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");

        setStep("success");
        setTimeout(() => {
          setIsOpen(false);
          setStep("confirm");
          onEnrollmentComplete?.();
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Enrollment failed");
      setStep("error");
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
      >
        Enroll Now - ${coursePrice}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          {step === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Enrollment</DialogTitle>
                <DialogDescription>Ready to start learning?</DialogDescription>
              </DialogHeader>

              <Card className="p-6 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Course</p>
                    <p className="text-lg font-semibold text-gray-900">{courseName}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">Total Price:</span>
                    <span className="text-2xl font-bold text-blue-600">${coursePrice}</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      ✓ Lifetime access to course materials
                    </p>
                    <p className="text-sm text-blue-900">
                      ✓ Certificate of completion
                    </p>
                    <p className="text-sm text-blue-900">
                      ✓ 30-day money-back guarantee
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEnroll} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Continue to Payment
                </Button>
              </div>
            </>
          )}

          {step === "payment" && (
            <>
              <DialogHeader>
                <DialogTitle>Processing Payment</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col items-center justify-center py-8">
                <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-700 font-medium">Redirecting to payment...</p>
                <p className="text-sm text-gray-600 mt-2">A new window should open shortly</p>
              </div>
            </>
          )}

          {step === "success" && (
            <>
              <DialogHeader>
                <DialogTitle>Enrollment Successful!</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                <p className="text-gray-900 font-semibold text-lg mb-2">Welcome to {courseName}!</p>
                <p className="text-sm text-gray-600 text-center">
                  Check your email for access details. You can now start learning!
                </p>
              </div>

              <Button onClick={() => setIsOpen(false)} className="w-full bg-green-600 hover:bg-green-700">
                Start Learning
              </Button>
            </>
          )}

          {step === "error" && (
            <>
              <DialogHeader>
                <DialogTitle>Enrollment Failed</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
                <p className="text-gray-900 font-semibold text-lg mb-2">Something went wrong</p>
                <p className="text-sm text-gray-600 text-center mb-4">{errorMessage}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setStep("confirm");
                    setErrorMessage("");
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setStep("confirm");
                    setErrorMessage("");
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
