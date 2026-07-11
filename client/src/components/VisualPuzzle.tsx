import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface DragItem {
  id: string;
  label: string;
  value: string;
  x: number;
  y: number;
}

interface VisualPuzzleProps {
  title: string;
  description: string;
  items: Array<{ id: string; label: string; correctPosition: { x: number; y: number } }>;
  onComplete?: (score: number) => void;
}

export default function VisualPuzzle({ title, description, items, onComplete }: VisualPuzzleProps) {
  const [placedItems, setPlacedItems] = useState<DragItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, item: DragItem) => {
    e.preventDefault();
    setDragging(item.id);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - item.x,
        y: e.clientY - rect.top - item.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 100, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - 40, e.clientY - rect.top - dragOffset.y));

    setPlacedItems((prev) =>
      prev.map((item) => (item.id === dragging ? { ...item, x, y } : item))
    );
  };

  const handleMouseUp = () => {
    if (!dragging) return;

    const placed = placedItems.find((item) => item.id === dragging);
    const target = items.find((item) => item.id === dragging);

    if (placed && target) {
      const distance = Math.sqrt(
        Math.pow(placed.x - target.correctPosition.x, 2) +
          Math.pow(placed.y - target.correctPosition.y, 2)
      );

      let earnedPoints = 0;
      if (distance < 30) {
        earnedPoints = 100;
        setIsComplete(true);
      } else if (distance < 80) {
        earnedPoints = 50;
      }

      setScore((prev) => prev + earnedPoints);
      onComplete?.(earnedPoints);
    }

    setDragging(null);
  };

  const handleReset = () => {
    setPlacedItems([]);
    setScore(0);
    setIsComplete(false);
  };

  const placeItem = (item: { id: string; label: string }) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newItem: DragItem = {
      id: item.id,
      label: item.label,
      value: item.id,
      x: rect.width / 2 - 50,
      y: rect.height / 2 - 20,
    };

    setPlacedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, newItem];
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isComplete ? "default" : "outline"}>
              Score: {score}
            </Badge>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative w-full h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`absolute px-3 py-2 rounded-lg text-sm font-medium cursor-grab select-none transition-all ${
                  isComplete
                    ? "bg-green-100 text-green-800 border-2 border-green-300"
                    : "bg-white text-slate-700 border-2 border-slate-300 shadow-sm hover:shadow-md"
                }`}
                style={{
                  left: placedItems.find((p) => p.id === item.id)?.x ?? item.correctPosition.x,
                  top: placedItems.find((p) => p.id === item.id)?.y ?? item.correctPosition.y,
                  transform: dragging === item.id ? "scale(1.05)" : "scale(1)",
                  zIndex: dragging === item.id ? 50 : 1,
                }}
                onMouseDown={(e) => handleMouseDown(e, placedItems.find((p) => p.id === item.id) || { id: item.id, label: item.label, value: item.id, x: item.correctPosition.x, y: item.correctPosition.y })}
              >
                {item.label}
              </div>
            ))}

            {placedItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                Drag items to their correct positions
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant="outline"
                onClick={() => placeItem(item)}
                disabled={placedItems.some((p) => p.id === item.id)}
                className="gap-1"
              >
                <ArrowRight className="w-3 h-3" />
                {item.label}
              </Button>
            ))}
          </div>

          {isComplete && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                Puzzle complete! You earned {score} points.
              </p>
              <p className="text-xs text-green-600 mt-1">
                Great job! You've mastered this concept.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
