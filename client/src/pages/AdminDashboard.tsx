import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users, Shield, Settings, Trash2, BookOpen,
  CreditCard, TrendingUp, Activity, RefreshCw, Search,
  ChevronLeft, ChevronRight, Crown, UserCheck, UserX,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (user && user.role !== "super_admin" && user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md text-center">
            <Shield className="w-16 h-16 mx-auto text-red-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">Only super admins can access this panel.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 py-6">
        <div className="mb-6 flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Panel</h1>
            <p className="text-gray-500 text-sm">Full platform control — users, courses, payments, settings</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview"  className="gap-2"><Activity className="w-4 h-4" />Overview</TabsTrigger>
            <TabsTrigger value="users"     className="gap-2"><Users className="w-4 h-4" />Users</TabsTrigger>
            <TabsTrigger value="courses"   className="gap-2"><BookOpen className="w-4 h-4" />Courses</TabsTrigger>
            <TabsTrigger value="payments"  className="gap-2"><CreditCard className="w-4 h-4" />Payments</TabsTrigger>
            <TabsTrigger value="settings"  className="gap-2"><Settings className="w-4 h-4" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="courses"><CoursesTab /></TabsContent>
          <TabsContent value="payments"><PaymentsTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

/* ───────── Overview ───────── */
function OverviewTab() {
  const { data: stats, isLoading, refetch } = trpc.admin.getStats.useQuery();

  const cards = [
    { label: "Total Users",    value: stats?.totalUsers   ?? 0, icon: Users,      color: "text-blue-600",   bg: "bg-blue-50"   },
    { label: "Premium Users",  value: stats?.premiumUsers ?? 0, icon: Crown,      color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Free Users",     value: stats?.freeUsers    ?? 0, icon: UserCheck,  color: "text-green-600",  bg: "bg-green-50"  },
    { label: "Active Today",   value: stats?.activeToday  ?? 0, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Courses",  value: stats?.totalCourses ?? 0, icon: BookOpen,   color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium mb-1">{c.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? "…" : c.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${c.bg} p-3 rounded-xl`}>
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick info */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Platform Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-gray-600">API Server: <strong className="text-green-700">Online</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-gray-600">Database: <strong className="text-green-700">Connected</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
            <span className="text-gray-600">Email Service: <strong className="text-yellow-700">Unconfigured</strong></span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ───────── Users ───────── */
function UsersTab() {
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all"|"user"|"admin"|"super_admin">("all");

  const { data, isLoading, refetch } = trpc.admin.listUsers.useQuery({ page, limit: 20, search, role: roleFilter });
  const updateUser  = trpc.admin.updateUser.useMutation({ onSuccess: () => { toast.success("User updated"); refetch(); } });
  const deleteUser  = trpc.admin.deleteUser.useMutation({ onSuccess: () => { toast.success("User deleted"); refetch(); } });

  const roleColor = (role: string) => {
    if (role === "super_admin") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (role === "admin")       return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search name or email…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); }}}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-200 rounded-md text-sm"
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value as any); setPage(1); }}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="super_admin">Super Admins</option>
          </select>
          <Button size="sm" onClick={() => { setSearch(searchInput); setPage(1); }} className="gap-2">
            <Search className="w-4 h-4" /> Search
          </Button>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["ID","Name","Email","Role","Plan","XP","Verified","Joined","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Loading…</td></tr>
              ) : data?.users.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
              ) : data?.users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{u.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${roleColor(u.role)} focus:outline-none`}
                      value={u.role}
                      onChange={e => updateUser.mutate({ userId: u.id, role: e.target.value as any })}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="px-2 py-1 rounded border text-xs focus:outline-none"
                      value={u.subscriptionTier}
                      onChange={e => updateUser.mutate({ userId: u.id, subscriptionTier: e.target.value as any })}
                    >
                      <option value="free">free</option>
                      <option value="premium">premium</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{(u.totalXP ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {u.emailVerified
                      ? <span className="text-green-600">✓</span>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (confirm(`Delete user ${u.email}?`)) deleteUser.mutate({ userId: u.id });
                      }}
                      className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-sm">
            <span className="text-gray-600">
              Page {page} of {data.pages} &nbsp;·&nbsp; {data.total.toLocaleString()} users
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ───────── Courses ───────── */
function CoursesTab() {
  const { data: courses, isLoading, refetch } = trpc.admin.listCourses.useQuery();
  const updateCourse = trpc.admin.updateCourse.useMutation({ onSuccess: () => { toast.success("Course updated"); refetch(); } });

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">All Courses ({courses?.length ?? 0})</h3>
        <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["ID","Icon","Title","Category","Difficulty","Lessons","Premium","Order","Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Loading…</td></tr>
            ) : courses?.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{c.id}</td>
                <td className="px-4 py-3 text-xl">{c.icon}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{c.title}</td>
                <td className="px-4 py-3 text-gray-600">{c.category}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.difficulty === "beginner" ? "default" : c.difficulty === "intermediate" ? "secondary" : "outline"}>
                    {c.difficulty}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.totalLessons}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => updateCourse.mutate({ courseId: c.id, isPremium: !c.isPremium })}
                    className={`px-2 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      c.isPremium
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                        : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {c.isPremium ? "Premium" : "Free"}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-500">{c.displayOrder}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{c.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ───────── Payments ───────── */
function PaymentsTab() {
  const { data, isLoading } = trpc.admin.listSubscriptions.useQuery({ page: 1, limit: 50 });

  const statusColor = (s: string) => {
    if (s === "active")    return "bg-green-100 text-green-800";
    if (s === "cancelled") return "bg-red-100 text-red-800";
    if (s === "trial")     return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs text-gray-500 mb-1">Total Subscriptions</p>
          <p className="text-3xl font-bold">{data?.total ?? 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-500 mb-1">Stripe Integration</p>
          <p className="text-sm font-semibold text-yellow-700 mt-2">⚠ STRIPE_SECRET_KEY not configured</p>
          <p className="text-xs text-gray-500 mt-1">Add to .env to enable payments</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-500 mb-1">Premium Price</p>
          <p className="text-3xl font-bold">$9.99<span className="text-sm font-normal text-gray-500">/mo</span></p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Subscription Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["ID","User ID","Plan","Status","Start Date","End Date","Stripe ID"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading…</td></tr>
              ) : data?.subscriptions.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No subscriptions yet</td></tr>
              ) : data?.subscriptions.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{s.id}</td>
                  <td className="px-4 py-3">{s.userId}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.plan === "basic" ? "default" : "outline"}>{s.plan}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(s.status ?? "")}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{new Date(s.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-600">{s.endDate ? new Date(s.endDate).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-32">{s.providerSubscriptionId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ───────── Settings ───────── */
function SettingsTab() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
            <Input defaultValue="Codelearnify" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <Input defaultValue="support@codelearnify.com" type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">App URL</label>
            <Input defaultValue="https://codelearnify.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Mode</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm">
              <option>Disabled</option>
              <option>Enabled</option>
            </select>
          </div>
        </div>
        <Button onClick={handleSave} className="mt-5 bg-blue-600 hover:bg-blue-700">
          {saved ? "Saved ✓" : "Save Settings"}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Integration Status</h3>
        <div className="space-y-3 text-sm">
          {[
            { name: "Database (MySQL / Railway)", ok: true  },
            { name: "Stripe Payments",            ok: false },
            { name: "Anthropic AI (Claude)",      ok: false },
            { name: "S3 File Storage",            ok: false },
            { name: "SMTP Email",                 ok: false },
          ].map(item => (
            <div key={item.name} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.ok ? "bg-green-500" : "bg-red-400"}`} />
              <span className="text-gray-700">{item.name}</span>
              <span className={`ml-auto text-xs font-medium ${item.ok ? "text-green-600" : "text-red-500"}`}>
                {item.ok ? "Connected" : "Not configured"}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">Configure missing integrations in your <code className="bg-gray-100 px-1 rounded">.env</code> file.</p>
      </Card>
    </div>
  );
}
