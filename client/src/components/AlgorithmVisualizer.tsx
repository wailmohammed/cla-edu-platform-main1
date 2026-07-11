import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, SkipForward, SkipBack, CheckCircle2 } from "lucide-react";

interface ArrayElement {
  value: number;
  color: string;
  comparing?: boolean;
  swapping?: boolean;
  sorted?: boolean;
}

interface AlgorithmVisualizerProps {
  title: string;
  description: string;
  algorithm: "bubbleSort" | "selectionSort" | "insertionSort";
  initialArray?: number[];
  onComplete?: () => void;
}

export default function AlgorithmVisualizer({
  title,
  description,
  algorithm,
  initialArray = [64, 34, 25, 12, 22, 11, 90],
  onComplete,
}: AlgorithmVisualizerProps) {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(500);
  const stepsRef = useRef<ArrayElement[][]>([]);

  const colorPalette = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
  ];

  const initializeArray = useCallback(() => {
    const newArray: ArrayElement[] = initialArray.map((value, index) => ({
      value,
      color: colorPalette[index % colorPalette.length],
    }));
    setArray(newArray);
    setIsComplete(false);
    setCurrentStep(0);
    stepsRef.current = [newArray];
  }, [initialArray]);

  useEffect(() => {
    initializeArray();
  }, [initializeArray]);

  const bubbleSort = async (arr: ArrayElement[]): Promise<ArrayElement[][]> => {
    const steps: ArrayElement[][] = [];
    const result = [...arr.map((item) => ({ ...item }))];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        result[j].comparing = true;
        result[j + 1].comparing = true;
        steps.push([...result.map((item) => ({ ...item }))]);

        await new Promise((resolve) => setTimeout(resolve, speed));

        if (result[j].value > result[j + 1].value) {
          result[j].swapping = true;
          result[j + 1].swapping = true;
          steps.push([...result.map((item) => ({ ...item }))]);

          await new Promise((resolve) => setTimeout(resolve, speed));

          const temp = result[j];
          result[j] = result[j + 1];
          result[j + 1] = temp;

          result[j].swapping = false;
          result[j + 1].swapping = false;
        }

        result[j].comparing = false;
        result[j + 1].comparing = false;
      }
      result[n - i - 1].sorted = true;
    }
    result[0].sorted = true;
    steps.push([...result.map((item) => ({ ...item }))]);

    return steps;
  };

  const selectionSort = async (arr: ArrayElement[]): Promise<ArrayElement[][]> => {
    const steps: ArrayElement[][] = [];
    const result = [...arr.map((item) => ({ ...item }))];
    const n = result.length;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      result[minIdx].comparing = true;

      for (let j = i + 1; j < n; j++) {
        result[j].comparing = true;
        steps.push([...result.map((item) => ({ ...item }))]);

        await new Promise((resolve) => setTimeout(resolve, speed));

        if (result[j].value < result[minIdx].value) {
          if (minIdx !== i) result[minIdx].comparing = false;
          minIdx = j;
          result[minIdx].comparing = true;
        } else {
          result[j].comparing = false;
        }
      }

      if (minIdx !== i) {
        result[minIdx].swapping = true;
        result[i].swapping = true;
        steps.push([...result.map((item) => ({ ...item }))]);

        await new Promise((resolve) => setTimeout(resolve, speed));

        const temp = result[i];
        result[i] = result[minIdx];
        result[minIdx] = temp;

        result[minIdx].swapping = false;
        result[i].swapping = false;
      }

      result[minIdx].comparing = false;
      result[i].sorted = true;
    }

    steps.push([...result.map((item) => ({ ...item }))]);
    return steps;
  };

  const insertionSort = async (arr: ArrayElement[]): Promise<ArrayElement[][]> => {
    const steps: ArrayElement[][] = [];
    const result = [...arr.map((item) => ({ ...item }))];
    const n = result.length;

    for (let i = 1; i < n; i++) {
      let j = i;
      result[i].comparing = true;

      while (j > 0 && result[j].value < result[j - 1].value) {
        result[j].swapping = true;
        result[j - 1].swapping = true;
        steps.push([...result.map((item) => ({ ...item }))]);

        await new Promise((resolve) => setTimeout(resolve, speed));

        const temp = result[j];
        result[j] = result[j - 1];
        result[j - 1] = temp;

        result[j].swapping = false;
        result[j - 1].swapping = false;
        j--;
      }

      for (let k = 0; k <= i; k++) {
        result[k].comparing = false;
      }
    }

    for (let k = 0; k < n; k++) {
      result[k].sorted = true;
    }

    steps.push([...result.map((item) => ({ ...item }))]);
    return steps;
  };

  const runAlgorithm = async () => {
    setIsRunning(true);
    let steps: ArrayElement[][] = [];

    if (algorithm === "bubbleSort") {
      steps = await bubbleSort(array);
    } else if (algorithm === "selectionSort") {
      steps = await selectionSort(array);
    } else if (algorithm === "insertionSort") {
      steps = await insertionSort(array);
    }

    stepsRef.current = steps;
    setCurrentStep(0);
    setIsComplete(false);

    for (let i = 0; i < steps.length; i++) {
      setArray(steps[i]);
      setCurrentStep(i + 1);
      await new Promise((resolve) => setTimeout(resolve, speed));
    }

    setIsComplete(true);
    setIsRunning(false);
    onComplete?.();
  };

  const stepForward = () => {
    if (currentStep < stepsRef.current.length) {
      setArray(stepsRef.current[currentStep]);
      setCurrentStep((prev) => prev + 1);
    }
    if (currentStep >= stepsRef.current.length - 1) {
      setIsComplete(true);
    }
  };

  const stepBackward = () => {
    if (currentStep > 1) {
      setArray(stepsRef.current[currentStep - 2]);
      setCurrentStep((prev) => prev - 1);
      setIsComplete(false);
    }
  };

  const maxValue = Math.max(...array.map((item) => item.value));

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
            <Badge variant="outline">
              Step: {currentStep}/{stepsRef.current.length}
            </Badge>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="text-sm border border-slate-200 rounded px-2 py-1"
            >
              <option value="1000">Slow</option>
              <option value="500">Medium</option>
              <option value="200">Fast</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-end justify-center gap-2 h-48 p-4 bg-slate-50 rounded-lg border border-slate-200">
            {array.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-end transition-all duration-300 ${
                  item.sorted
                    ? "bg-green-500"
                    : item.swapping
                      ? "bg-red-500"
                      : item.comparing
                        ? "bg-yellow-500"
                        : item.color
                } rounded-t-lg min-w-[40px]`}
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                }}
              >
                <span className="text-white font-bold text-sm mb-1">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={stepBackward}
              disabled={isRunning || currentStep <= 1}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={runAlgorithm}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? "Running..." : isComplete ? "Run Again" : "Run Algorithm"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={stepForward}
              disabled={isRunning || currentStep >= stepsRef.current.length}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={initializeArray}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span>Unsorted</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span>Comparing</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span>Swapping</span>
            </div>
          </div>

          {isComplete && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                Algorithm complete! The array is now sorted.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
