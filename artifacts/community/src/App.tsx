import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect, useLocation, Link } from 'wouter';
import { ClerkProvider, SignIn, SignUp, Show, useClerk, bypassEnabled } from '@/lib/clerk';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { useEffect, useRef } from 'react';
import { useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import { Loader2 } from 'lucide-react';

// Import Pages
import { Shell } from '@/components/layout/Shell';
import MainRoom from '@/pages/main-room';
import WebinarPage from '@/pages/webinar';
import UniversityPage from '@/pages/university';
import EventsPage from '@/pages/events';
import AccountPage from '@/pages/account';
import SupportPage from '@/pages/support';
import MembershipPendingPage from '@/pages/membership-pending';
import AdminMembersPage from '@/pages/admin/members';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { BrandLogo, LogoMark } from '@/components/brand/BrandLogo';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// Real Clerk config is only needed when the dev bypass is off.
const clerkPubKey = bypassEnabled
  ? undefined
  : publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = bypassEnabled ? undefined : import.meta.env.VITE_CLERK_PROXY_URL;

if (!bypassEnabled && !clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

// ── VectorVest navy + gold Clerk theme ────────────────────────────
// Cardless: the form sits inside our own AuthLayout panel, so Clerk renders
// transparent and we supply the branding around it.
const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  variables: {
    colorPrimary:          "hsl(38 52% 57%)",   // gold
    colorBackground:       "transparent",
    colorForeground:       "hsl(210 40% 96%)",
    colorMutedForeground:  "hsl(220 20% 58%)",
    colorInput:            "hsl(237 43% 22%)",
    colorInputForeground:  "hsl(210 40% 96%)",
    colorNeutral:          "hsl(237 43% 26%)",
    colorDanger:           "hsl(0 62% 38%)",
    fontFamily:            "'Inter', sans-serif",
    borderRadius:          "0.625rem",
  },
  elements: {
    rootBox:                       "w-full",
    cardBox:                       "w-full !shadow-none !border-0 !bg-transparent",
    card:                          "!shadow-none !border-0 !bg-transparent !p-0",
    header:                        "text-left mb-2",
    headerTitle:                   "text-foreground font-bold text-2xl font-display tracking-tight",
    headerSubtitle:                "text-muted-foreground text-sm mt-1",
    socialButtonsBlockButtonText:  "text-foreground font-medium",
    formFieldLabel:                "text-foreground font-medium text-sm",
    footerActionLink:              "text-primary font-semibold hover:text-primary/90",
    footerActionText:              "text-muted-foreground",
    dividerText:                   "text-muted-foreground text-xs uppercase tracking-wider",
    identityPreviewEditButton:     "text-primary",
    formFieldSuccessText:          "text-primary",
    alertText:                     "text-foreground",
    socialButtonsBlockButton:      "border-border hover:bg-accent bg-card/60 text-foreground h-11 rounded-lg transition-colors",
    formButtonPrimary:             "bg-gradient-to-b from-[hsl(38_58%_62%)] to-[hsl(38_52%_52%)] hover:from-[hsl(38_58%_66%)] hover:to-[hsl(38_52%_56%)] text-primary-foreground font-bold rounded-lg h-11 shadow-lg shadow-primary/20 transition-all",
    formFieldInput:                "bg-input/50 border-border h-11 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors",
    footerAction:                  "bg-transparent",
    dividerLine:                   "bg-border",
    alert:                         "bg-destructive/20 border-destructive rounded-lg",
    otpCodeFieldInput:             "border-border bg-input/50 text-foreground rounded-lg",
    formFieldRow:                  "mb-4",
    main:                          "w-full",
  },
};

// ── Sign-in / Sign-up pages ────────────────────────────────────────
function SignInPage() {
  return (
    <AuthLayout>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </AuthLayout>
  );
}

function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </AuthLayout>
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
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/5">
        <BrandLogo size="sm" />
        <Link
          href="/sign-in"
          className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
        >
          Inloggen →
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

        {/* VV mark — large, crisp, with a soft gold halo */}
        <div className="mb-8">
          <LogoMark
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto"
            style={{ filter: 'drop-shadow(0 0 48px hsl(38 52% 57% / 0.28))' }}
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Community · België & Nederland
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight text-balance">
          VectorVest<br />
          <span className="text-primary">Community</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/60 mb-10 max-w-xl leading-relaxed text-balance">
          De besloten community voor serieuze beleggers. Realtime discussie,
          webinars en dagelijkse VectorVest-analyses — allemaal op één plek.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-b from-[hsl(38_58%_62%)] to-[hsl(38_52%_52%)] px-10 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-w-[170px]"
          >
            Word lid
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-10 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-white/10 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[170px]"
          >
            Inloggen
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex items-center gap-6 sm:gap-8 text-foreground/30 text-xs font-medium tracking-wide">
          <span>37 JAAR ERVARING</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <span>1M+ BELEGGERS</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <span>BE · NL</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex justify-center pb-6">
        <p className="text-foreground/25 text-xs">
          © {new Date().getFullYear()} VectorVest Community België &amp; Nederland.
        </p>
      </footer>
    </div>
  );
}

// ── Route guards ───────────────────────────────────────────────────
function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/room/chat" /></Show>
      <Show when="signed-out"><LandingPage /></Show>
    </>
  );
}

function MembershipGate({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!me || me.membershipStatus !== "verified") {
    return <MembershipPendingPage />;
  }

  return <Shell>{children}</Shell>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in"><MembershipGate>{children}</MembershipGate></Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!me || me.membershipStatus !== "verified" || me.role !== "admin") {
    return <Redirect to="/room/chat" />;
  }

  return <Shell>{children}</Shell>;
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

  const clerkProps = bypassEnabled
    ? { appearance: clerkAppearance, publishableKey: 'dev-bypass' }
    : {
        publishableKey: clerkPubKey!,
        proxyUrl: clerkProxyUrl,
        appearance: clerkAppearance,
        signInUrl: `${basePath}/sign-in`,
        signUpUrl: `${basePath}/sign-up`,
        localization: {
          signIn: { start: { title: "Welcome back", subtitle: "Sign in to access the community" } },
          signUp: { start: { title: "Join VectorVest", subtitle: "Become part of the community" } },
        },
        routerPush: (to: string) => setLocation(stripBase(to)),
        routerReplace: (to: string) => setLocation(stripBase(to), { replace: true }),
      };

  return (
    <ClerkProvider {...clerkProps}>
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
          <Route path="/admin/members">
            <AdminRoute><AdminMembersPage /></AdminRoute>
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
