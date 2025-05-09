import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Roadmap from "@/pages/Roadmap";
import FeaturesPage from "@/pages/features-page";
import FeaturesBuilderPage from "@/pages/features-builder-page";
import AdminLoginPage from "@/pages/admin/login-page";
import TemplatesPage from "@/pages/admin/templates-page";
import CategoriesPage from "@/pages/admin/categories-page";
import TagsPage from "@/pages/admin/tags-page";
import LabelsPage from "@/pages/admin/labels-page";
import PageBuilderPage from "@/pages/admin/page-builder";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/features-builder" component={FeaturesBuilderPage} />
      
      {/* Admin Routes */}
      <Route path="/dashboard/login" component={AdminLoginPage} />
      <ProtectedRoute path="/dashboard/templates" component={TemplatesPage} />
      <ProtectedRoute path="/dashboard/categories" component={CategoriesPage} />
      <ProtectedRoute path="/dashboard/tags" component={TagsPage} />
      <ProtectedRoute path="/dashboard/labels" component={LabelsPage} />
      <ProtectedRoute path="/dashboard/page-builder" component={PageBuilderPage} />
      
      {/* Catch-all route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
