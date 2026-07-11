import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { User, Settings, LogOut, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();

  /* ── Change Password dialog ── */
  const [showChangePwd, setShowChangePwd]   = useState(false);
  const [currentPwd,    setCurrentPwd]      = useState("");
  const [newPwd,        setNewPwd]          = useState("");
  const [confirmPwd,    setConfirmPwd]      = useState("");
  const [showPwd,       setShowPwd]         = useState(false);
  const [pwdLoading,    setPwdLoading]      = useState(false);

  /* ── Delete Account dialog ── */
  const [showDeleteDlg,  setShowDeleteDlg]  = useState(false);
  const [deleteConfirm,  setDeleteConfirm]  = useState("");
  const [deleteLoading,  setDeleteLoading]  = useState(false);

  /* ── 2FA info dialog ── */
  const [show2FA, setShow2FA] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      await logout();
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd) { toast.error("Enter your current password"); return; }
    if (newPwd.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (newPwd !== confirmPwd) { toast.error("Passwords don't match"); return; }
    setPwdLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Password changed successfully");
      setShowChangePwd(false);
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch (e: any) {
      toast.error(e.message || "Could not change password");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") { toast.error('Type DELETE to confirm'); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete account");
      toast.success("Account deleted");
      await logout();
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Could not delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{user.name || "User"}</h3>
                  <p className="text-sm text-slate-600 mt-1">{user.email}</p>
                  <Badge className="mt-3" variant="outline">
                    {user.role === "super_admin" ? "⭐ Super Admin" : user.role === "admin" ? "Admin" : "Member"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Member Since</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Last Active</span>
                  <span className="font-medium">{new Date(user.lastSignedIn).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account" className="gap-2"><User className="w-4 h-4" />Account</TabsTrigger>
                <TabsTrigger value="preferences" className="gap-2"><Settings className="w-4 h-4" />Preferences</TabsTrigger>
                <TabsTrigger value="security" className="gap-2"><Shield className="w-4 h-4" />Security</TabsTrigger>
              </TabsList>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>View and manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={user.name || ""} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={user.email || ""} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="login-method">Login Method</Label>
                      <Input id="login-method" value={user.loginMethod || "email/password"} disabled className="mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Current Plan</p>
                        <p className="text-sm text-slate-600 mt-1">
                          {user.subscriptionTier === "premium" ? "Premium — $9.99/month" : "Free Plan"}
                        </p>
                      </div>
                      <Badge variant={user.subscriptionTier === "premium" ? "default" : "outline"}>
                        {user.subscriptionTier === "premium" ? "Active" : "Free"}
                      </Badge>
                    </div>
                    {user.subscriptionTier === "free" && (
                      <Button className="w-full" onClick={() => navigate("/pricing")}>
                        Upgrade to Premium
                      </Button>
                    )}
                    {user.subscriptionTier === "premium" && (
                      <Button variant="outline" className="w-full" onClick={() => navigate("/payment")}>
                        Manage Subscription
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Preferences</CardTitle>
                    <CardDescription>Customize your learning experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="goal">Learning Goal</Label>
                      <Input id="goal" value={user.learningGoal || "Not set"} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="path">Recommended Path</Label>
                      <Input id="path" value={user.recommendedPath || "Not set"} disabled className="mt-1" />
                    </div>
                    <Button variant="outline" onClick={() => navigate("/onboarding")}>
                      Retake Learning Assessment
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Daily Reminders", desc: "Get reminded to continue your streak", defaultChecked: true },
                      { label: "Achievement Updates", desc: "Notifications for badges and milestones", defaultChecked: true },
                      { label: "Marketing Emails", desc: "Receive updates about new courses", defaultChecked: false },
                    ].map(item => (
                      <label key={item.label} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4"
                          onChange={() => toast.info(`${item.label} preference updated`)} />
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-slate-600">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                    <Button className="w-full" onClick={() => toast.success("Notification preferences saved")}>
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-900">
                        ✓ Your account is secured with email/password authentication
                      </p>
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => setShowChangePwd(true)}>
                      <Shield className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>

                    <Button variant="outline" className="w-full" onClick={() => setShow2FA(true)}>
                      <Shield className="w-4 h-4 mr-2" />
                      Enable Two-Factor Authentication
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full" onClick={handleLogout} disabled={logoutMutation.isPending}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDlg(true)}>
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showChangePwd} onOpenChange={setShowChangePwd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Current Password</Label>
              <div className="relative mt-1">
                <Input type={showPwd ? "text" : "password"} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Current password" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" className="mt-1" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min. 8 characters" />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input type="password" className="mt-1" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Repeat new password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePwd(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={pwdLoading}>
              {pwdLoading ? "Saving..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Info Dialog */}
      <Dialog open={show2FA} onOpenChange={setShow2FA}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>Add an extra layer of security to your account.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              Two-Factor Authentication (2FA) is coming soon. You'll be able to use an authenticator app (Google Authenticator, Authy) to secure your account.
            </div>
            <p className="text-sm text-slate-600">In the meantime, make sure you have a strong, unique password set for your account.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShow2FA(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDlg} onOpenChange={setShowDeleteDlg}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>This is permanent and cannot be undone. All your data, progress, and subscriptions will be lost.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              ⚠ This will permanently delete your account and all associated data.
            </div>
            <div>
              <Label>Type <strong>DELETE</strong> to confirm</Label>
              <Input className="mt-2" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDlg(false); setDeleteConfirm(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading || deleteConfirm !== "DELETE"}>
              {deleteLoading ? "Deleting..." : "Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
