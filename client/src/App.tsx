import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Pricing from "@/pages/Pricing";
import Leaderboard from "./pages/Leaderboard";
import Portfolio from "./pages/Portfolio";
import AdvancedFeatures from "./pages/AdvancedFeatures";
import EnhancedFeatures from "./pages/EnhancedFeatures";
import Collaboration from "./pages/Collaboration";
import CommunityAndResources from "./pages/CommunityAndResources";
import { MentorMatching } from "./pages/MentorMatching";
import { JobBoard } from "./pages/JobBoard";
import { PaymentPage } from "./pages/PaymentPage";
import { CourseDetail } from "./pages/CourseDetail";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminPanel } from "./pages/AdminPanel";
import { Achievements } from "./pages/Achievements";
import { Social } from "./pages/Social";
import { NotificationCenter } from "./pages/NotificationCenter";
import { NotificationPreferences } from "./pages/NotificationPreferences";
import { LeaderboardEnhanced } from "./pages/LeaderboardEnhanced";
import StreakNotifications from "@/pages/StreakNotifications";
import ReferralSystem from "@/pages/ReferralSystem";
import BadgesPage from "@/pages/BadgesPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import SuccessPage from "./pages/SuccessPage";
import AITutorEnhanced from "./pages/AITutorEnhanced";
import AgentsPage from "./pages/AgentsPage";
import StudyGroupsEnhanced from "./pages/StudyGroupsEnhanced";
import ProgressAnalyticsEnhanced from "./pages/ProgressAnalyticsEnhanced";
import EmailPreferencesPage from "./pages/EmailPreferencesPage";
import AdminDashboard from "./pages/AdminDashboard";
import LessonViewer from "@/pages/LessonViewer";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import OracleDashboard from "@/pages/OracleDashboard";
import Scorecard from "@/pages/Scorecard";
import Alerts from "@/pages/Alerts";
import Brief from "@/pages/Brief";
import Personas from "@/pages/Personas";
import MCP from "@/pages/MCP";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAccessibilityEnhancements } from "./components/AccessibilityEnhancements";
import Home from "./pages/Home";
import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
});

function Router() {
  useAccessibilityEnhancements();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/courses" component={Courses} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/advanced" component={AdvancedFeatures} />
      <Route path="/enhanced" component={EnhancedFeatures} />
      <Route path="/collaborate" component={Collaboration} />
      <Route path="/community" component={CommunityAndResources} />
      <Route path="/lesson/:id" component={LessonViewer} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/profile" component={Profile} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/mentors" component={MentorMatching} />
      <Route path="/jobs" component={JobBoard} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/course/:id" component={CourseDetail} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/notifications" component={NotificationCenter} />
      <Route path="/social" component={Social} />
      <Route path="/notification-preferences" component={NotificationPreferences} />
      <Route path="/leaderboard-enhanced" component={LeaderboardEnhanced} />
      <Route path="/streaks" component={StreakNotifications} />
      <Route path="/referral" component={ReferralSystem} />
      <Route path="/badges" component={BadgesPage} />
      <Route path="/leaderboard-global" component={LeaderboardPage} />
      <Route path="/success" component={SuccessPage} />
      <Route path="/ai-tutor" component={AITutorEnhanced} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/study-groups" component={StudyGroupsEnhanced} />
      <Route path="/analytics" component={ProgressAnalyticsEnhanced} />
      <Route path="/email-preferences" component={EmailPreferencesPage} />
      <Route path="/oracle" component={OracleDashboard} />
      <Route path="/scorecard" component={Scorecard} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/brief" component={Brief} />
      <Route path="/personas" component={Personas} />
      <Route path="/mcp" component={MCP} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <main id="main-content">
                <Router />
              </main>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

export default App;
