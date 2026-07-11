import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Lightbulb, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface TutorOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  userCode?: string;
  onApplyHint?: (hint: string) => void;
}

export default function TutorOverlay({ isOpen, onClose, topic, userCode = "", onApplyHint }: TutorOverlayProps) {
  const [hint, setHint] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const hintMutation = trpc.aiTutor.getHint.useMutation();

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: window.innerWidth - 340, y: window.innerHeight - 300 });
      showHint();
    }
  }, [isOpen]);

  const showHint = async () => {
    setIsLoading(true);
    try {
      const result = await hintMutation.mutateAsync({
        topic,
        userCode,
        hintLevel: "moderate",
      });

      if (result.success && result.hint) {
        setHint(result.hint);
      }
    } catch (error) {
      setHint("Take your time and think about the problem step by step. What have you tried so far?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragStart.x)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStart.y)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card className="w-80 shadow-2xl border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg flex items-center justify-between cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold">Koji</span>
              <Badge className="bg-white/20 text-white text-xs border-0">Tutor</Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-slate-100 rounded-lg rounded-tl-none p-3 max-w-[200px]">
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-200 rounded w-full animate-pulse" />
                      <div className="h-2 bg-slate-200 rounded w-3/4 animate-pulse" />
                      <div className="h-2 bg-slate-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-lg rounded-tl-none p-3 flex-1">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {hint || "I'm here to help! Try thinking about the problem from a different angle. What do you think the first step should be?"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pl-11">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={showHint}
                    className="text-xs gap-1"
                  >
                    <Lightbulb className="w-3 h-3" />
                    Another hint
                  </Button>
                  <Button
                    size="sm"
                    onClick={onClose}
                    className="text-xs gap-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Got it! <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
