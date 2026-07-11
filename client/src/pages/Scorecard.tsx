import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Scorecard() {
  const query = trpc.educationOracle.scorecard.useQuery();

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const data = query.data as any;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Prediction Scorecard</h1>
        <p className="text-muted-foreground mb-6">How accurate have the oracle's forecasts been?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Brier Score</CardTitle>
              <CardDescription>0 = perfect, 0.25 = coin-flip</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.brier?.toFixed(3) || "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Hit Rate</CardTitle>
              <CardDescription>Fraction of correct forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.hit_rate ? `${Math.round(data.hit_rate * 100)}%` : "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resolved</CardTitle>
              <CardDescription>Total graded forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.resolved || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Resolutions</CardTitle>
          </CardHeader>
          <CardContent>
            {!data.recent?.length && (
              <p className="text-sm text-muted-foreground">No resolved forecasts yet. They appear once their horizon expires.</p>
            )}
            <div className="space-y-3">
              {data.recent?.map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{r.statement || r.predictionId}</p>
                    <p className="text-xs text-muted-foreground">{r.evidence || ""}</p>
                  </div>
                  <Badge variant={r.verdict === "yes" ? "default" : r.verdict === "no" ? "destructive" : "outline"}>
                    {r.verdict}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
