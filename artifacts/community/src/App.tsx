import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect, useLocation, Link } from 'wouter';
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { useEffect, useRef } from 'react';

// Import Pages
import { Shell } from '@/components/layout/Shell';
import MainRoom from '@/pages/main-room';
import WebinarPage from '@/pages/webinar';
import UniversityPage from '@/pages/university';
import EventsPage from '@/pages/events';
import AccountPage from '@/pages/account';
import SupportPage from '@/pages/support';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

// ── VectorVest navy + gold Clerk theme ────────────────────────────
const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/vv-logo.png`,
  },
  variables: {
    colorPrimary:          "hsl(38 52% 57%)",   // gold
    colorBackground:       "hsl(237 51% 18%)",  // navy card
    colorForeground:       "hsl(210 40% 96%)",
    colorMutedForeground:  "hsl(220 20% 58%)",
    colorInput:            "hsl(237 43% 22%)",
    colorInputForeground:  "hsl(210 40% 96%)",
    colorNeutral:          "hsl(237 43% 26%)",
    colorDanger:           "hsl(0 62% 38%)",
    fontFamily:            "'Inter', sans-serif",
    borderRadius:          "0.5rem",
  },
  elements: {
    rootBox:                       "w-full flex justify-center",
    cardBox:                       "rounded-2xl w-[440px] max-w-full overflow-hidden border border-[hsl(237_43%_26%)] shadow-2xl",
    card:                          "!shadow-none !border-0 !rounded-none",
    footer:                        "!shadow-none !border-0 !rounded-none",
    headerTitle:                   "text-foreground font-bold text-xl",
    headerSubtitle:                "text-muted-foreground",
    socialButtonsBlockButtonText:  "text-foreground font-medium",
    formFieldLabel:                "text-foreground font-medium",
    footerActionLink:              "text-primary hover:text-primary/90",
    footerActionText:              "text-muted-foreground",
    dividerText:                   "text-muted-foreground",
    identityPreviewEditButton:     "text-primary",
    formFieldSuccessText:          "text-primary",
    alertText:                     "text-foreground",
    logoBox:                       "mb-2 px-2",
    logoImage:                     "h-8 w-auto object-contain",
    socialButtonsBlockButton:      "border-border hover:bg-accent bg-background text-foreground",
    formButtonPrimary:             "bg-primary hover:bg-primary/90 text-primary-foreground font-bold",
    formFieldInput:                "bg-input border-border text-foreground placeholder:text-muted-foreground",
    footerAction:                  "bg-transparent",
    dividerLine:                   "bg-border",
    alert:                         "bg-destructive/20 border-destructive",
    otpCodeFieldInput:             "border-border bg-input text-foreground",
    formFieldRow:                  "mb-4",
    main:                          "w-full",
  },
};

// ── Sign-in / Sign-up pages ────────────────────────────────────────
function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative diagonal */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-primary rounded-full blur-3xl" />
      </div>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-primary rounded-full blur-3xl" />
      </div>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

// ── Landing Page ───────────────────────────────────────────────────
function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-background flex flex-col overflow-hidden">

      {/* Background: subtle diagonal stripe echoing the VV logo */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Large diagonal band */}
        <div
          className="absolute opacity-[0.04]"
          style={{
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: 'linear-gradient(135deg, transparent 35%, white 35%, white 40%, transparent 40%)',
          }}
        />
        {/* Gold glow bottom-left (mimics the gold triangle in the logo) */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-10"
          style={{ background: 'radial-gradient(ellipse at 0% 100%, hsl(38 52% 57%) 0%, transparent 70%)' }}
        />
        {/* Navy glow top-right */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at 100% 0%, hsl(237 70% 30%) 0%, transparent 70%)' }}
        />
      </div>

      {/* Top bar — mirrors the nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <img
          src={`${basePath}/vv-logo.png`}
          alt="VectorVest"
          className="h-8 w-auto object-contain opacity-90"
        />
        <Link
          href="/sign-in"
          className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
        >
          Sign In →
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

        {/* VV icon — large */}
        <div className="mb-8">
          <img
            src={`${basePath}/vv-icon.jpeg`}
            alt="VectorVest"
            className="w-24 h-24 rounded-2xl shadow-2xl border border-white/10 mx-auto"
            style={{ boxShadow: '0 0 60px hsl(38 52% 57% / 0.25)' }}
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Community · Europe
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          VectorVest<br />
          <span className="text-primary">Community</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/60 mb-10 max-w-xl leading-relaxed">
          The exclusive real-time community room for serious investors.{" "}
          Insights, webinars, and live discussion — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-10 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[160px]"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 bg-white/5 px-10 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-white/10 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[160px]"
          >
            Join Community
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex items-center gap-8 text-foreground/30 text-xs font-medium tracking-wide">
          <span>1M+ TRUSTED INVESTORS</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <span>15K+ REVIEWS</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <span>37 YEARS OF EXPERIENCE</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex justify-center pb-6">
        <p className="text-foreground/25 text-xs">
          © {new Date().getFullYear()} VectorVest Europe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ── Route guards ───────────────────────────────────────────────────
function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/room/main-chat" /></Show>
      <Show when="signed-out"><LandingPage /></Show>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in"><Shell>{children}</Shell></Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to access the community" } },
        signUp: { start: { title: "Join VectorVest", subtitle: "Become part of the community" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/"          component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />

          <Route path="/room/:channelId?">
            <ProtectedRoute><MainRoom /></ProtectedRoute>
          </Route>
          <Route path="/webinar">
            <ProtectedRoute><WebinarPage /></ProtectedRoute>
          </Route>
          <Route path="/university">
            <ProtectedRoute><UniversityPage /></ProtectedRoute>
          </Route>
          <Route path="/events">
            <ProtectedRoute><EventsPage /></ProtectedRoute>
          </Route>
          <Route path="/support">
            <ProtectedRoute><SupportPage /></ProtectedRoute>
          </Route>
          <Route path="/account">
            <ProtectedRoute><AccountPage /></ProtectedRoute>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <TooltipProvider>
        <ClerkProviderWithRoutes />
        <Toaster />
      </TooltipProvider>
    </WouterRouter>
  );
}

export default App;
