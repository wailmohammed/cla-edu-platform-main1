import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, Globe, Plus, Settings, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface PaymentProvider {
  id: number;
  provider: "stripe" | "paypal" | "paddle";
  isActive: boolean | null;
  isDefault: boolean | null;
  environment: "sandbox" | "production" | null;
}

export function PaymentProviderManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<PaymentProvider | null>(null);
  const [formData, setFormData] = useState({
    provider: "stripe" as "stripe" | "paypal" | "paddle",
    isActive: true,
    isDefault: false,
    environment: "sandbox" as "sandbox" | "production",
    apiKey: "",
    apiSecret: "",
    webhookSecret: "",
    clientId: "",
    clientSecret: "",
  });

  const { data: providers, isLoading } = trpc.paymentConfig.getProviders.useQuery();
  const { data: defaultProvider } = trpc.paymentConfig.getDefaultProvider.useQuery();

  const createMutation = trpc.paymentConfig.createProvider.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = trpc.paymentConfig.updateProvider.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      setEditingProvider(null);
      resetForm();
    },
  });

  const deleteMutation = trpc.paymentConfig.deleteProvider.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      setEditingProvider(null);
    },
  });

  const testMutation = trpc.paymentConfig.testProvider.useMutation();

  const resetForm = () => {
    setFormData({
      provider: "stripe",
      isActive: true,
      isDefault: false,
      environment: "sandbox",
      apiKey: "",
      apiSecret: "",
      webhookSecret: "",
      clientId: "",
      clientSecret: "",
    });
  };

  const handleEdit = (provider: PaymentProvider) => {
    setEditingProvider(provider);
    setFormData({
      provider: provider.provider,
      isActive: provider.isActive ?? false,
      isDefault: provider.isDefault ?? false,
      environment: provider.environment ?? "sandbox",
      apiKey: "",
      apiSecret: "",
      webhookSecret: "",
      clientId: "",
      clientSecret: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProvider) {
      updateMutation.mutate({
        id: editingProvider.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleTest = (provider: "stripe" | "paypal" | "paddle") => {
    testMutation.mutate({ provider });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this payment provider?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "stripe":
        return <CreditCard className="h-5 w-5" />;
      case "paypal":
        return <Wallet className="h-5 w-5" />;
      case "paddle":
        return <Globe className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "stripe":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "paypal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "paddle":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Providers</h2>
          <p className="text-muted-foreground">Manage your payment gateway configurations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProvider(null); resetForm(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProvider ? "Edit Payment Provider" : "Add Payment Provider"}
              </DialogTitle>
              <DialogDescription>
                Configure your payment gateway settings. Credentials will be encrypted.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={formData.provider}
                    onValueChange={(value: any) => setFormData({ ...formData, provider: value })}
                    disabled={!!editingProvider}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="paddle">Paddle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={formData.environment}
                    onValueChange={(value: any) => setFormData({ ...formData, environment: value })}
                  >
                    <SelectTrigger id="environment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>

                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="isDefault">Default Provider</Label>
              </div>

              <Tabs defaultValue="credentials" className="w-full">
                <TabsList>
                  <TabsTrigger value="credentials">Credentials</TabsTrigger>
                  <TabsTrigger value="webhook">Webhook</TabsTrigger>
                </TabsList>

                <TabsContent value="credentials" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      placeholder="Enter API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiSecret">API Secret</Label>
                    <Input
                      id="apiSecret"
                      type="password"
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                      placeholder="Enter API secret"
                    />
                  </div>

                  {(formData.provider === "paypal" || formData.provider === "paddle") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="clientId">Client ID</Label>
                        <Input
                          id="clientId"
                          type="password"
                          value={formData.clientId}
                          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                          placeholder="Enter client ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clientSecret">Client Secret</Label>
                        <Input
                          id="clientSecret"
                          type="password"
                          value={formData.clientSecret}
                          onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                          placeholder="Enter client secret"
                        />
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="webhook" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">Webhook Secret</Label>
                    <Input
                      id="webhookSecret"
                      type="password"
                      value={formData.webhookSecret}
                      onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                      placeholder="Enter webhook secret"
                    />
                    <p className="text-sm text-muted-foreground">
                      Used to verify webhook signatures from the payment provider
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {editingProvider ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers?.map((provider) => (
          <Card key={provider.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getProviderIcon(provider.provider)}
                  <CardTitle className="capitalize">{provider.provider}</CardTitle>
                </div>
                <Badge className={getProviderColor(provider.provider)}>
                  {provider.environment}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                {provider.isActive ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    Inactive
                  </>
                )}
                {provider.isDefault && (
                  <Badge variant="secondary" className="ml-2">
                    Default
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(provider)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTest(provider.provider)}
                  disabled={testMutation.isPending}
                >
                  {testMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Test"
                  )}
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => handleDelete(provider.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers?.length === 0 && (
        <Card className="p-8 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Payment Providers Configured</h3>
          <p className="text-muted-foreground mb-4">
            Add a payment provider to enable course purchases and subscriptions
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Provider
          </Button>
        </Card>
      )}
    </div>
  );
}
