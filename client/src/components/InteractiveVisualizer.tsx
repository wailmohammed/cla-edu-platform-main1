import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface InteractiveVisualizerProps {
  type: "algorithm" | "datastructure" | "math" | "physics";
  title: string;
  description?: string;
}

export default function InteractiveVisualizer({
  type,
  title,
  description,
}: InteractiveVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [step, setStep] = useState(0);

  const renderVisualization = () => {
    switch (type) {
      case "algorithm":
        return (
          <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Sorting Algorithm Visualization</h3>
                <p className="text-sm text-slate-600">Step {step + 1} of 10</p>
              </div>
              <div className="flex justify-center gap-2">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-12 rounded transition-all ${
                      i <= step
                        ? "bg-gradient-to-t from-blue-600 to-blue-400"
                        : "bg-slate-300"
                    }`}
                    style={{
                      height: `${(i + 1) * 12}px`,
                      transform: `scale(${zoom})`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-slate-600 mt-4">
                Comparing and swapping elements...
              </div>
            </div>
          </div>
        );

      case "datastructure":
        return (
          <div className="w-full h-96 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Binary Tree Structure</h3>
              </div>
              <svg className="w-full h-64" viewBox="0 0 400 300">
                {/* Root */}
                <circle cx="200" cy="40" r="20" fill="#3b82f6" />
                <text x="200" y="47" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  A
                </text>

                {/* Lines */}
                <line x1="200" y1="60" x2="100" y2="120" stroke="#94a3b8" strokeWidth="2" />
                <line x1="200" y1="60" x2="300" y2="120" stroke="#94a3b8" strokeWidth="2" />

                {/* Left subtree */}
                <circle cx="100" cy="140" r="20" fill="#8b5cf6" />
                <text x="100" y="147" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  B
                </text>

                {/* Right subtree */}
                <circle cx="300" cy="140" r="20" fill="#8b5cf6" />
                <text x="300" y="147" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  C
                </text>

                {/* Leaf nodes */}
                <line x1="100" y1="160" x2="50" y2="220" stroke="#94a3b8" strokeWidth="2" />
                <line x1="100" y1="160" x2="150" y2="220" stroke="#94a3b8" strokeWidth="2" />
                <line x1="300" y1="160" x2="250" y2="220" stroke="#94a3b8" strokeWidth="2" />
                <line x1="300" y1="160" x2="350" y2="220" stroke="#94a3b8" strokeWidth="2" />

                <circle cx="50" cy="240" r="15" fill="#ec4899" />
                <circle cx="150" cy="240" r="15" fill="#ec4899" />
                <circle cx="250" cy="240" r="15" fill="#ec4899" />
                <circle cx="350" cy="240" r="15" fill="#ec4899" />
              </svg>
            </div>
          </div>
        );

      case "math":
        return (
          <div className="w-full h-96 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Quadratic Function</h3>
                <p className="text-sm text-slate-600">f(x) = x² - 2x - 3</p>
              </div>
              <svg className="w-full h-64" viewBox="0 0 400 300">
                {/* Grid */}
                {[...Array(9)].map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={50 + i * 40}
                    y1="20"
                    x2={50 + i * 40}
                    y2="280"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}
                {[...Array(7)].map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="10"
                    y1={20 + i * 40}
                    x2="390"
                    y2={20 + i * 40}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}

                {/* Axes */}
                <line x1="50" y1="280" x2="390" y2="280" stroke="#000" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="280" stroke="#000" strokeWidth="2" />

                {/* Parabola */}
                <path
                  d="M 50 200 Q 150 80 250 200 T 390 200"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="none"
                />

                {/* Points */}
                <circle cx="150" cy="80" r="4" fill="#ef4444" />
                <circle cx="250" cy="200" r="4" fill="#ef4444" />
              </svg>
            </div>
          </div>
        );

      case "physics":
        return (
          <div className="w-full h-96 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Projectile Motion</h3>
              </div>
              <svg className="w-full h-64" viewBox="0 0 400 300">
                {/* Ground */}
                <line x1="20" y1="250" x2="380" y2="250" stroke="#92400e" strokeWidth="3" />

                {/* Trajectory */}
                <path
                  d="M 50 200 Q 150 100 300 200"
                  stroke="#f97316"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />

                {/* Projectile */}
                <circle
                  cx={50 + step * 25}
                  cy={200 - Math.sin((step / 10) * Math.PI) * 100}
                  r="8"
                  fill="#ef4444"
                />

                {/* Velocity vector */}
                <line
                  x1={50 + step * 25}
                  y1={200 - Math.sin((step / 10) * Math.PI) * 100}
                  x2={50 + step * 25 + 30}
                  y2={200 - Math.sin((step / 10) * Math.PI) * 100 - 20}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />

                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Badge variant="outline">{type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visualization */}
        {renderVisualization()}

        {/* Controls */}
        <div className="space-y-4 border-t pt-4">
          {/* Playback Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStep(0);
                setIsPlaying(false);
              }}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Speed: {speed}x</label>
            <Slider
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              min={0.5}
              max={2}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Zoom Control */}
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              className="gap-1"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-600 flex-1 text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.2))}
              className="gap-1"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Step Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Step: {step + 1}/10</label>
            <Slider
              value={[step]}
              onValueChange={(value) => {
                setStep(value[0]);
                setIsPlaying(false);
              }}
              min={0}
              max={9}
              step={1}
              className="w-full"
            />
          </div>

          {/* Info */}
          <p className="text-xs text-slate-600 text-center">
            Interact with the visualization to understand concepts better. Adjust speed and zoom as needed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
