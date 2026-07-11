import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { Lightbulb, Zap, RefreshCw, BookOpen, Bug } from "lucide-react";
import { toast } from "sonner";

interface CopilotPanelProps {
  code: string;
  language: string;
}

export default function CopilotPanel({ code, language }: CopilotPanelProps) {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [context, setContext] = useState("");

  // AI Copilot mutations
  const suggestMutation = trpc.copilot.getSuggestions.useMutation();
  const analyzeMutation = trpc.copilot.analyzeCode.useMutation();
  const generateMutation = trpc.copilot.generateCode.useMutation();
  const explainMutation = trpc.copilot.explainCode.useMutation();
  const refactorMutation = trpc.copilot.refactorCode.useMutation();

  const handleGetSuggestions = async () => {
    try {
      await suggestMutation.mutateAsync({
        code,
        language,
        context,
      });
      toast.success("Suggestions generated!");
    } catch (error) {
      toast.error("Failed to get suggestions");
    }
  };

  const handleAnalyzeCode = async () => {
    try {
      await analyzeMutation.mutateAsync({
        code,
        language,
      });
      toast.success("Code analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze code");
    }
  };

  const handleExplainCode = async () => {
    try {
      await explainMutation.mutateAsync({
        code,
        language,
      });
      toast.success("Explanation generated!");
    } catch (error) {
      toast.error("Failed to explain code");
    }
  };

  const handleRefactorCode = async () => {
    try {
      await refactorMutation.mutateAsync({
        code,
        language,
        goal: "improve performance and readability",
      });
      toast.success("Refactoring suggestions generated!");
    } catch (error) {
      toast.error("Failed to refactor code");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">AI Copilot</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            Beta
          </Badge>
        </div>
        <CardDescription>Get AI-powered code suggestions and improvements</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="suggestions" className="text-xs">
              <Lightbulb className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              <Bug className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="explain" className="text-xs">
              <BookOpen className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="refactor" className="text-xs">
              <RefreshCw className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="generate" className="text-xs">
              <Zap className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Context (optional)</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describe what you're trying to do..."
                className="w-full h-20 p-2 border border-slate-200 rounded-md text-sm resize-none"
              />
            </div>
            <Button
              onClick={handleGetSuggestions}
              disabled={suggestMutation.isPending || !code}
              className="w-full"
            >
              {suggestMutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Generating...
                </>
              ) : (
                "Get Suggestions"
              )}
            </Button>
            {suggestMutation.data && (
              <div className="space-y-2 mt-3">
                {suggestMutation.data.suggestions?.completions?.length > 0 && (
                  <div className="p-2 bg-blue-50 rounded-md">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Completions:</p>
                    <ul className="text-xs space-y-1">
                      {suggestMutation.data.suggestions.completions.map((s: any, i: number) => (
                        <li key={i} className="text-blue-800">
                          • {typeof s === "string" ? s.substring(0, 100) : s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-3">
            <Button
              onClick={handleAnalyzeCode}
              disabled={analyzeMutation.isPending || !code}
              className="w-full"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Analyzing...
                </>
              ) : (
                "Analyze Code"
              )}
            </Button>
            {analyzeMutation.data?.analysis && (
              <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                <p className="text-xs font-semibold text-amber-900 mb-2">Issues Found:</p>
                <p className="text-xs text-amber-800 whitespace-pre-wrap">
                  {analyzeMutation.data.analysis.substring(0, 300)}...
                </p>
              </div>
            )}
          </TabsContent>

          {/* Explain Tab */}
          <TabsContent value="explain" className="space-y-3">
            <Button
              onClick={handleExplainCode}
              disabled={explainMutation.isPending || !code}
              className="w-full"
            >
              {explainMutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Explaining...
                </>
              ) : (
                "Explain Code"
              )}
            </Button>
            {explainMutation.data?.explanation && (
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-xs font-semibold text-green-900 mb-2">Explanation:</p>
                <p className="text-xs text-green-800 whitespace-pre-wrap">
                  {explainMutation.data.explanation.substring(0, 300)}...
                </p>
              </div>
            )}
          </TabsContent>

          {/* Refactor Tab */}
          <TabsContent value="refactor" className="space-y-3">
            <Button
              onClick={handleRefactorCode}
              disabled={refactorMutation.isPending || !code}
              className="w-full"
            >
              {refactorMutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Refactoring...
                </>
              ) : (
                "Refactor Code"
              )}
            </Button>
            {refactorMutation.data?.refactoredCode && (
              <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                <p className="text-xs font-semibold text-purple-900 mb-2">Refactored Code:</p>
                <pre className="text-xs text-purple-800 overflow-x-auto">
                  {refactorMutation.data.refactoredCode.substring(0, 300)}...
                </pre>
              </div>
            )}
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Describe the code you want to generate..."
                className="w-full h-20 p-2 border border-slate-200 rounded-md text-sm resize-none"
              />
            </div>
            <Button
              onClick={() => {
                toast.info("Code generation - describe what you need");
              }}
              className="w-full"
            >
              Generate Code
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
