import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import Home from "./pages/Home";
import BlogListing from "./pages/BlogListing";
import BlogPost from "./pages/BlogPost";
import AdminPanel from "./pages/AdminPanel";
import AdminOverview from "./pages/AdminOverview";
import FeaturesShowcase from "./pages/FeaturesShowcase";
import { Footer } from "./components/Footer";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/features"} component={FeaturesShowcase} />
          <Route path={"/blog"} component={BlogListing} />
          <Route path={"/blog/:slug"} component={BlogPost} />
          <Route path={"/admin"} component={AdminOverview} />
          <Route path={"/admin/:tab"} component={AdminPanel} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <TranslationProvider>
        <ThemeProvider
          defaultTheme="light"
          switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </TranslationProvider>
    </ErrorBoundary>
  );
}

export default App;
