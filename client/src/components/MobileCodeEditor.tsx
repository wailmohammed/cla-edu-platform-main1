import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Send, Keyboard, Code2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface MobileCodeEditorProps {
  language?: string;
  defaultCode?: string;
  testCases?: Array<{ input: string; expectedOutput: string; description: string }>;
  onSubmit?: (code: string) => Promise<boolean>;
  exerciseId?: number;
  readOnly?: boolean;
}

export default function MobileCodeEditor({
  language = "python",
  defaultCode = "# Write your solution here\ndef solve():\n    pass",
  testCases = [],
  onSubmit,
  exerciseId,
  readOnly = false,
}: MobileCodeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "output" | "keys">("editor");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runMutation = trpc.codeExecution.execute.useMutation();
  const submitMutation = trpc.codeExecution.validateSolution.useMutation();

  useEffect(() => {
    if (showKeyboard && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showKeyboard]);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const result = await runMutation.mutateAsync({
        code,
        language: language as "javascript" | "python" | "typescript",
      });

      if (result.success) {
        setOutput(result.output);
        setActiveTab("output");
        toast.success("Code executed!");
      } else {
        setOutput(result.error || "Unknown error");
        setActiveTab("output");
        toast.error(result.error || "Execution failed");
      }
    } catch (error) {
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

      if (result.passed) {
        toast.success(`All tests passed! +${result.xpEarned} XP`);
        setActiveTab("output");
        setOutput(`Success! ${result.passedTests}/${result.totalTests} tests passed.\n+${result.xpEarned} XP earned!`);
      } else {
        toast.error(`Only ${result.passedTests}/${result.totalTests} tests passed`);
        setActiveTab("output");
        setOutput(`Failed: ${result.passedTests}/${result.totalTests} tests passed.\n\n${result.testResults.filter((r: { passed: boolean; description: string; expected: string; actual: string }) => !r.passed).map((r: { passed: boolean; description: string; expected: string; actual: string }) => `✗ ${r.description}: expected "${r.expected}", got "${r.actual}"`).join("\n")}`);
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

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.slice(0, start) + text + code.slice(end);
    setCode(newCode);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const quickKeys = [
    { label: "def", key: "def " },
    { label: "():", key: "():" },
    { label: "return", key: "return " },
    { label: "if", key: "if " },
    { label: "else:", key: "else:\n    " },
    { label: "for", key: "for " },
    { label: "while", key: "while " },
    { label: "import", key: "import " },
    { label: "print", key: "print(" },
    { label: "input()", key: "input()" },
    { label: "range", key: "range(" },
    { label: "[]", key: "[]" },
  ];

  const indentationKeys = [
    { label: "    ", key: "    " },
    { label: "→", key: "\t" },
    { label: "=", key: "=" },
    { label: "==", key: "==" },
    { label: "!=", key: "!=" },
    { label: "+", key: "+" },
    { label: "-", key: "-" },
    { label: "*", key: "*" },
    { label: "/", key: "/" },
    { label: "//", key: "//" },
    { label: "#", key: "# " },
    { label: "\"", key: "\"" },
    { label: "'", key: "'" },
    { label: "(", key: "(" },
    { label: ")", key: ")" },
    { label: ":", key: ":" },
    { label: "\n", key: "\n" },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Code Editor</CardTitle>
            <Badge variant="outline">{language.toUpperCase()}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="text-xs"
            >
              <Keyboard className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <Button
            size="sm"
            variant={activeTab === "editor" ? "default" : "ghost"}
            onClick={() => setActiveTab("editor")}
            className="flex-1 text-xs"
          >
            <Code2 className="w-3 h-3 mr-1" />
            Editor
          </Button>
          <Button
            size="sm"
            variant={activeTab === "output" ? "default" : "ghost"}
            onClick={() => setActiveTab("output")}
            className="flex-1 text-xs"
          >
            Output
          </Button>
          <Button
            size="sm"
            variant={activeTab === "keys" ? "default" : "ghost"}
            onClick={() => setActiveTab("keys")}
            className="flex-1 text-xs"
          >
            <Keyboard className="w-3 h-3 mr-1" />
            Keys
          </Button>
        </div>

        {/* Editor Tab */}
        {activeTab === "editor" && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={readOnly}
                className="w-full h-64 p-4 bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none border-none rounded-lg"
                placeholder="Write your code here..."
                spellCheck="false"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <div className="absolute bottom-2 right-2 text-xs text-slate-500">
                {code.split("\n").length} lines
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCode(defaultCode)}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRun}
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                Run
              </Button>
              {exerciseId && (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Output Tab */}
        {activeTab === "output" && (
          <div className="space-y-3">
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm min-h-48 max-h-64 overflow-auto whitespace-pre-wrap break-words">
              {output || (
                <span className="text-slate-500">
                  Run your code to see output here...
                </span>
              )}
            </div>
            {testCases.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600">
                  Test Cases ({testCases.length})
                </p>
              {testCases.map((tc: { input: string; expectedOutput: string; description: string }, i: number) => (
                <div key={i} className="text-xs text-slate-600 p-2 bg-slate-50 rounded">
                  Test {i + 1}: {tc.description}
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Keys Tab */}
        {activeTab === "keys" && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Quick Commands</p>
              <div className="grid grid-cols-4 gap-2">
                {quickKeys.map((item) => (
                  <Button
                    key={item.label}
                    size="sm"
                    variant="outline"
                    onClick={() => insertText(item.key)}
                    className="text-xs font-mono"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Symbols & Operators</p>
              <div className="grid grid-cols-8 gap-1">
                {indentationKeys.map((item) => (
                  <Button
                    key={item.label}
                    size="sm"
                    variant="ghost"
                    onClick={() => insertText(item.key)}
                    className="text-xs font-mono h-10"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertText("    ")}
                className="flex-1 text-xs"
              >
                Indent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    setCode(code.slice(0, start) + "\n" + code.slice(start));
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = start + 1;
                      textarea.focus();
                    }, 0);
                  }
                }}
                className="flex-1 text-xs"
              >
                New Line
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const lineStart = code.lastIndexOf("\n", start - 1) + 1;
                    const lineEnd = code.indexOf("\n", end);
                    const actualEnd = lineEnd === -1 ? code.length : lineEnd;
                    const line = code.slice(lineStart, actualEnd);
                    setCode(code.slice(0, lineStart) + line.trimStart() + code.slice(actualEnd));
                    setTimeout(() => textarea.focus(), 0);
                  }
                }}
                className="flex-1 text-xs"
              >
                Unindent
              </Button>
            </div>
          </div>
        )}

        {/* Mobile hint */}
        <p className="text-xs text-slate-500 text-center">
          Tap keys to insert. Use the keyboard tab for quick symbols.
        </p>
      </CardContent>
    </Card>
  );
}
