import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function Alerts() {
  const utils = trpc.useUtils();
  const listQuery = trpc.alerts.list.useQuery();
  const feedQuery = trpc.alerts.feed.useQuery({ since: 0, limit: 50 });
  const createMutation = trpc.alerts.create.useMutation();
  const removeMutation = trpc.alerts.remove.useMutation();
  const evaluateMutation = trpc.alerts.evaluate.useMutation();

  const [name, setName] = useState("");
  const [kind, setKind] = useState("keyword");
  const [params, setParams] = useState("");

  const handleCreate = async () => {
    try {
      const parsed = JSON.parse(params || "{}");
      await createMutation.mutateAsync({ kind, name: name || "Untitled Rule", params: parsed });
      setName("");
      setParams("");
      utils.alerts.list.invalidate();
    } catch {}
  };

  const handleRemove = async (id: number) => {
    await removeMutation.mutateAsync({ id });
    utils.alerts.list.invalidate();
  };

  const rules = listQuery.data || [];
  const feed = feedQuery.data?.alerts || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Intervention Alerts</h1>
        <p className="text-muted-foreground mb-6">Signal rules for early student intervention.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> New Rule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Low quiz score" />
              </div>
              <div>
                <Label>Kind</Label>
                <select className="w-full mt-1 p-2 border rounded-md bg-background" value={kind} onChange={(e) => setKind(e.target.value)}>
                  <option value="keyword">Keyword</option>
                  <option value="quiz">Quiz score</option>
                  <option value="streak">Streak risk</option>
                  <option value="category">Category</option>
                </select>
              </div>
              <div>
                <Label>Params (JSON)</Label>
                <textarea className="w-full min-h-[80px] p-2 border rounded-md bg-background text-sm font-mono" value={params} onChange={(e) => setParams(e.target.value)} placeholder='{"keywords": "struggle,stuck"}' />
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Rule"}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Rules ({rules.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {rules.length === 0 && <p className="text-sm text-muted-foreground">No rules yet.</p>}
                <div className="space-y-2">
                  {rules.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">Kind: {r.kind}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemove(r.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Alert Feed</span>
                  <Button variant="outline" size="sm" onClick={() => evaluateMutation.mutate()}>
                    {evaluateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Evaluate Now"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feed.length === 0 && <p className="text-sm text-muted-foreground">No alerts yet.</p>}
                <div className="space-y-2">
                  {feed.map((a: any, i: number) => (
                    <div key={i} className="p-3 border rounded-md">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
