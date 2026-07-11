import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Globe, Brain, AlertTriangle, Bell } from "lucide-react";

export default function OracleDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const utils = trpc.useUtils();

  const agentQuery = trpc.educationOracle.agentView.useQuery(undefined, { refetchInterval: 30000 });
  const predictMutation = trpc.educationOracle.predict.useMutation();
  const whatIfMutation = trpc.educationOracle.whatIf.useMutation();
  const [scenario, setScenario] = useState("");

  const latestBrief = trpc.brief.latest.useQuery();

  const handlePredict = async () => {
    await predictMutation.mutateAsync();
    utils.educationOracle.agentView.invalidate();
  };

  const handleWhatIf = async () => {
    if (!scenario.trim()) return;
    await whatIfMutation.mutateAsync({ scenario, personas: ["Tutor", "Critic", "Mentor", "Analyst"] });
  };

  const state = agentQuery.data;
  const events = (state?.events_by_domain || {}) as Record<string, any[]>;
  const predictions = (state?.predictions || []) as any[];
  const domains = (state?.domains || {}) as Record<string, number>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Oracle Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Live learning intelligence — predict what happens next in the classroom.</p>
          </div>
          <Button onClick={handlePredict} disabled={predictMutation.isPending} size="lg">
            {predictMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...</>
            ) : (
              <><Brain className="mr-2 h-4 w-4" /> Run Forecast</>
            )}
          </Button>
        </div>

        {latestBrief.data && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Morning Brief
              </CardTitle>
              <CardDescription>Your latest morning digest</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{latestBrief.data.text}</p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Predictions ({predictions.length})</TabsTrigger>
            <TabsTrigger value="whatif">What If</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" /> Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{state?.event_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Live learning signals</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Brain className="h-4 w-4" /> Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{predictions.length}</p>
                  <p className="text-xs text-muted-foreground">Active forecasts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{Object.keys(domains).length}</p>
                  <p className="text-xs text-muted-foreground">Active domains</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Live Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{state?.summary || "Run a forecast to see the summary."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-3">
            {predictions.length === 0 && (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No predictions yet. Run a forecast.</CardContent></Card>
            )}
            {predictions.map((p: any) => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{p.statement}</CardTitle>
                    <Badge variant={p.probability >= 0.7 ? "default" : p.probability >= 0.4 ? "outline" : "destructive"}>
                      {Math.round(p.probability * 100)}%
                    </Badge>
                  </div>
                  <CardDescription>Horizon: {p.horizon} {p.location ? `· ${p.location}` : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{p.reasoning}</p>
                  {p.agents?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.agents.map((a: any, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {a.name}: {Math.round(a.probability * 100)}%
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="whatif" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Counterfactual Forecast</CardTitle>
                <CardDescription>Assume something happened — forecast the knock-on effects.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm"
                  placeholder="e.g., What if the student skips 3 days of practice?"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                />
                <Button onClick={handleWhatIf} disabled={whatIfMutation.isPending || !scenario.trim()}>
                  {whatIfMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Forecasting...</> : "Run What-If"}
                </Button>
                {whatIfMutation.data && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-md space-y-2">
                    <p className="text-sm font-medium">Narrative:</p>
                    <p className="text-sm whitespace-pre-wrap">{whatIfMutation.data.narrative}</p>
                    {(whatIfMutation.data.predictions || []).map((p: any, i: number) => (
                      <div key={i} className="text-sm flex items-center gap-2">
                        <Badge variant="outline">{p.horizon}</Badge>
                        <span>{Math.round(p.probability * 100)}%</span>
                        <span>{p.statement}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains" className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(domains).map(([cat, count]) => (
                <Card key={cat}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{cat}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {Object.keys(domains).length === 0 && (
              <p className="text-center text-muted-foreground py-8">Run a forecast to populate domains.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
