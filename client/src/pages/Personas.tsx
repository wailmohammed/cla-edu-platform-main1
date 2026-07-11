import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users } from "lucide-react";

export default function Personas() {
  const query = trpc.personas.list.useQuery();
  const personas = query.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          Oracle Personas
        </h1>
        <p className="text-muted-foreground mb-6">The council of specialists that deliberates every forecast.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personas.map((p: any) => (
            <Card key={p.id || p.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {p.name}
                </CardTitle>
                <CardDescription>{p.lens}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={p.isActive ? "default" : "secondary"}>
                  {p.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
