import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Copy, RotateCcw, Zap, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface CodeEditorProps {
  language?: string;
  defaultCode?: string;
  testCases?: Array<{ input: string; expectedOutput: string; description: string }>;
  onSubmit?: (code: string) => Promise<boolean>;
  exerciseId?: number;
  readOnly?: boolean;
}

export default function CodeEditor({
  language = "python",
  defaultCode = "# Write your solution here\ndef solve():\n    pass",
  testCases = [],
  onSubmit,
  exerciseId,
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; description: string; expected: string; actual: string }>
  >([]);
  const [activeTab, setActiveTab] = useState("output");

  const runMutation = trpc.codeExecution.execute.useMutation();
  const submitMutation = trpc.codeExecution.validateSolution.useMutation();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const result = await runMutation.mutateAsync({
        code,
        language: language as "javascript" | "python" | "typescript",
      });

      if (result.success) {
        setOutput(result.output);
        toast.success("Code executed successfully!");
      } else {
        setOutput(result.error || "Unknown error");
        toast.error(result.error || "Execution failed");
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!exerciseId) {
      toast.error("No exercise selected");
      return;
    }

    setIsRunning(true);
    try {
      const result = await submitMutation.mutateAsync({
        exerciseId,
        code,
        language: language as "javascript" | "python" | "typescript",
      });

      setTestResults(
        result.testResults.map((r) => ({
          passed: r.passed,
          description: r.description,
          expected: r.expected,
          actual: r.actual,
        }))
      );

      if (result.passed) {
        toast.success(`All tests passed! +${result.xpEarned} XP earned`);
        setActiveTab("tests");
      } else {
        toast.error(`Only ${result.passedTests}/${result.totalTests} tests passed`);
        setActiveTab("tests");
      }

      if (onSubmit) {
        await onSubmit(code);
      }
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput("");
    setTestResults([]);
    setActiveTab("output");
  };

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{language.toUpperCase()}</Badge>
          <span className="text-sm text-slate-600">
            {code.split("\n").length} lines
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <Card>
        <CardContent className="p-0">
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            {/* Editor Toolbar */}
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">main.{language === "typescript" ? "ts" : language === "javascript" ? "js" : "py"}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRun}
                  disabled={isRunning || readOnly}
                  className="gap-2 text-slate-300 hover:text-white"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRunning ? "Running..." : "Run"}
                </Button>
                {exerciseId && (
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isRunning || readOnly}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    Submit
                  </Button>
                )}
              </div>
            </div>

            {/* Code Area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={readOnly}
              className="w-full h-64 p-4 bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none border-none"
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>
        </CardContent>
      </Card>

      {/* Output & Test Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="tests">
            Test Cases ({testResults.length > 0 ? `${testResults.filter((r) => r.passed).length}/${testCases.length}` : testCases.length})
          </TabsTrigger>
        </TabsList>

        {/* Output Tab */}
        <TabsContent value="output">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Console Output
                {output && !output.includes("Error") && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                {output && output.includes("Error") && (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm min-h-24 max-h-48 overflow-auto whitespace-pre-wrap break-words">
                {output || (
                  <span className="text-slate-500">
                    Run your code to see output here...
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Cases Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Cases</CardTitle>
              <CardDescription>
                {testResults.length > 0
                  ? `${testResults.filter((r) => r.passed).length}/${testCases.length} passed`
                  : "Submit your code to see test results"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {testCases.length === 0 ? (
                <p className="text-sm text-slate-600">No test cases available</p>
              ) : testResults.length === 0 ? (
                <p className="text-sm text-slate-600">Click Submit to run test cases</p>
              ) : (
                testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${
                      result.passed
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{result.description}</span>
                      <Badge
                        variant={result.passed ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {result.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="font-medium">Expected:</span>{" "}
                        <code className="bg-white px-1 rounded">{result.expected}</code>
                      </p>
                      <p>
                        <span className="font-medium">Actual:</span>{" "}
                        <code className="bg-white px-1 rounded">{result.actual}</code>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            Run your code to see instant feedback. Submit to run all test cases and earn XP.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
