import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Bell } from "lucide-react";

export default function Brief() {
  const utils = trpc.useUtils();
  const latestQuery = trpc.brief.latest.useQuery();
  const historyQuery = trpc.brief.history.useQuery({ limit: 10 });
  const runMutation = trpc.brief.run.useMutation();

  const handleRun = async () => {
    await runMutation.mutateAsync();
    utils.brief.latest.invalidate();
    utils.brief.history.invalidate();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-7 w-7 text-primary" />
              Morning Brief
            </h1>
            <p className="text-muted-foreground mt-1">Your daily learning digest.</p>
          </div>
          <Button onClick={handleRun} disabled={runMutation.isPending}>
            {runMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Brief"}
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Latest Brief</CardTitle>
            {latestQuery.data && (
              <CardDescription>{new Date(latestQuery.data.ts).toLocaleString()}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {latestQuery.isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : latestQuery.data ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{latestQuery.data.text}</p>
            ) : (
              <p className="text-muted-foreground">No brief yet. Generate one to get started.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyQuery.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            )}
            <div className="space-y-3">
              {historyQuery.data?.map((b: any) => (
                <div key={b.id} className="p-3 border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">{new Date(b.ts).toLocaleString()}</p>
                  <p className="text-sm line-clamp-2">{b.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
