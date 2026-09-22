import { useEffect, useState } from "react";

import { AppShell } from "./components/layout/AppShell";
import { AssessmentPage } from "./pages/AssessmentPage";
import { LandingPage } from "./pages/LandingPage";

type AppRoute = "landing" | "assessment";

function getRouteFromHash(): AppRoute {
  return window.location.hash.startsWith("#assessment")
    ? "assessment"
    : "landing";
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(getRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (nextRoute: AppRoute) => {
    window.location.hash = nextRoute === "assessment" ? "assessment" : "";
  };

  return (
    <AppShell>
      {route === "assessment" ? (
        <AssessmentPage onExit={() => navigate("landing")} />
      ) : (
        <LandingPage onBegin={() => navigate("assessment")} />
      )}
    </AppShell>
  );
}
