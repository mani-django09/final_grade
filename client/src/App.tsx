import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GradeCalculator from "./pages/GradeCalculator";
import GpaCalculator from "./pages/GpaCalculator";
import TestGradeCalculator from "./pages/TestGradeCalculator";
import HighSchoolGpaCalculator from "./pages/HighSchoolGpaCalculator";
import WeightedGpaCalculator from "./pages/WeightedGpaCalculator";
import CumulativeGpaCalculator from "./pages/CumulativeGpaCalculator";
import ApScoreCalculator from "./pages/ApScoreCalculator";
import SatScoreCalculator from "./pages/SatScoreCalculator";

// These four are rarely a visitor's entry point and rarely reached from a
// calculator page, unlike the three calculators above (people bounce between
// those, so bundling them together avoids a chunk fetch on every switch).
// Splitting the low-traffic pages out keeps them off the critical path
// without costing the calculators anything.
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  // Client-side navigation keeps the old scroll position; start each page at the top.
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/grade-calculator"} component={GradeCalculator} />
        <Route path={"/gpa-calculator"} component={GpaCalculator} />
        <Route path={"/high-school-gpa-calculator"} component={HighSchoolGpaCalculator} />
        <Route path={"/weighted-gpa-calculator"} component={WeightedGpaCalculator} />
        <Route path={"/cumulative-gpa-calculator"} component={CumulativeGpaCalculator} />
        <Route path={"/ap-score-calculator"} component={ApScoreCalculator} />
        <Route path={"/sat-score-calculator"} component={SatScoreCalculator} />
        <Route path={"/test-grade-calculator"} component={TestGradeCalculator} />
        <Route path={"/about"} component={About} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/terms"} component={Terms} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;