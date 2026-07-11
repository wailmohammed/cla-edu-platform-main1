import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile update would be handled by backend in production
  const updatePreferencesMutation = trpc.auth.updatePreferences.useMutation();

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step === 1 && !goal) {
      toast.error("Please select a learning goal");
      return;
    }
    if (step === 2 && !experience) {
      toast.error("Please select your experience level");
      return;
    }
    if (step === 3 && interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const recommendedPath = [
        "python-fundamentals",
        "javascript-essentials",
        "html-css",
      ].filter((course) => (interests.includes("Web Development") && course.includes("javascript")) ||
                          (!interests.includes("Web Development") && course.includes("python")));

      await updatePreferencesMutation.mutateAsync({
        learningGoal: goal,
        recommendedPath: recommendedPath[0] || "python-fundamentals",
      });
      toast.success("Onboarding complete! Welcome to Codelearnify");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Onboarding error:", error);
      // If not authenticated (UNAUTHORIZED), preferences can't be saved but
      // we should still let the user proceed rather than blocking them.
      if (error?.data?.code === "UNAUTHORIZED" || error?.message?.includes("UNAUTHORIZED")) {
        toast.warning("Session expired — please log in again.");
        navigate("/login", { replace: true });
      } else {
        // Non-auth error: preferences failed but navigate anyway so the user isn't stuck
        toast.warning("Preferences couldn't be saved, but you can continue.");
        navigate("/dashboard", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        {/* Progress Bar */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Step {step} of 4</h2>
            <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <CardContent className="pt-8 pb-8">
          {/* Step 1: Learning Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">What's your learning goal?</h3>
                <p className="text-slate-600">
                  Help us personalize your learning experience
                </p>
              </div>

              <RadioGroup value={goal} onValueChange={setGoal}>
                <div className="space-y-3">
                  {[
                    {
                      value: "career-change",
                      label: "Career Change",
                      description: "I want to transition into tech",
                    },
                    {
                      value: "skill-upgrade",
                      label: "Skill Upgrade",
                      description: "I want to improve my existing skills",
                    },
                    {
                      value: "hobby",
                      label: "Hobby",
                      description: "I'm learning for fun and personal growth",
                    },
                    {
                      value: "interview-prep",
                      label: "Interview Prep",
                      description: "I'm preparing for technical interviews",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div>
                        <p className="font-medium text-slate-900">{option.label}</p>
                        <p className="text-sm text-slate-600">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Experience Level */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">What's your experience level?</h3>
                <p className="text-slate-600">
                  This helps us recommend the right courses
                </p>
              </div>

              <RadioGroup value={experience} onValueChange={setExperience}>
                <div className="space-y-3">
                  {[
                    {
                      value: "beginner",
                      label: "Beginner",
                      description: "I'm new to programming",
                    },
                    {
                      value: "intermediate",
                      label: "Intermediate",
                      description: "I have some programming experience",
                    },
                    {
                      value: "advanced",
                      label: "Advanced",
                      description: "I'm an experienced programmer",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div>
                        <p className="font-medium text-slate-900">{option.label}</p>
                        <p className="text-sm text-slate-600">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">What interests you?</h3>
                <p className="text-slate-600">
                  Select all that apply
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Web Development",
                  "Mobile Development",
                  "Data Science",
                  "Machine Learning",
                  "Backend Development",
                  "DevOps",
                  "Game Development",
                  "Cybersecurity",
                ].map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                  >
                    <Checkbox
                      checked={interests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <span className="font-medium text-slate-900">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">You're all set!</h3>
                <p className="text-slate-600">
                  Here's your personalized learning path
                </p>
              </div>

              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base">Your Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-slate-900">Goal:</span>{" "}
                      <span className="text-slate-600 capitalize">
                        {goal?.replace("-", " ")}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Level:</span>{" "}
                      <span className="text-slate-600 capitalize">{experience}</span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">Interests:</span>{" "}
                      <span className="text-slate-600">{interests.join(", ")}</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-base">Recommended Path</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-slate-700">
                      Based on your profile, we recommend starting with:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Python Fundamentals</li>
                      <li>JavaScript Basics</li>
                      <li>Web Development Essentials</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation Buttons */}
        <div className="px-6 pb-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {step < 4 ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? "Starting..." : "Start Learning"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
