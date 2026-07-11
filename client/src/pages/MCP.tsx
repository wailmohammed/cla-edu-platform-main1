import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const MCP_TOOLS = [
  { name: "get_student_progress", description: "Current learning state of a student", params: "userId" },
  { name: "get_course_events", description: "Recent learning activities", params: "userId, limit" },
  { name: "predict_completion", description: "Likelihood of course completion", params: "userId, courseId" },
  { name: "ask_tutor", description: "Grounded Q&A on course material", params: "question, topic" },
  { name: "get_class_analytics", description: "Aggregate class performance", params: "courseId" },
  { name: "list_predictions", description: "Current oracle forecasts", params: "horizon?, min_probability?" },
  { name: "get_alerts", description: "Recent intervention alerts", params: "since?" },
  { name: "get_brief", description: "Latest morning brief", params: "userId?" },
];

export default function MCP() {
  const [output, setOutput] = useState<string[]>([]);

  const callTool = async (tool: string) => {
    setOutput(prev => [...prev, `> mcp call ${tool}`]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Education MCP</h1>
        <p className="text-muted-foreground mb-6">Expose the education platform as native tools for Claude Code / MCP clients.</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Tools</CardTitle>
            <CardDescription>Register these in Claude Desktop or Claude Code as an MCP server.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto">
{JSON.stringify(MCP_TOOLS, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Config</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto">
{`{
  "mcpServers": {
    "education": {
      "command": "node",
      "args": ["server/mcp.js"],
      "env": {
        "DATABASE_URL": "your-db-url",
        "ANTHROPIC_API_KEY": "your-key"
      }
    }
  }
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
