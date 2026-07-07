import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Redirect } from 'wouter';

interface MockClerkUser {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  primaryEmailAddress: { emailAddress: string } | null;
  fullName: string | null;
}

const mockUser: MockClerkUser = {
  id: "bjarne",
  username: "bjarne",
  firstName: "Bjarne",
  lastName: null,
  imageUrl: "",
  primaryEmailAddress: { emailAddress: "bjarne@vectorvest.local" },
  get fullName() { return "Bjarne"; },
};

interface SignOutOptions {
  redirectUrl?: string;
}

interface ClerkListenerPayload {
  user: MockClerkUser | null;
}

type ClerkListener = (payload: ClerkListenerPayload) => void;

interface ClerkContextValue {
  user: MockClerkUser | null;
  signOut: (options?: SignOutOptions) => Promise<void>;
  addListener: (listener: ClerkListener) => () => void;
}

const ClerkContext = createContext<ClerkContextValue>({
  user: mockUser,
  signOut: async () => {},
  addListener: () => () => {},
});

// Accept any props the real ClerkProvider is given; we ignore the auth ones.
export function ClerkProvider({ children }: { children: ReactNode }) {
  const listeners = useMemo(() => new Set<ClerkListener>(), []);

  const value = useMemo<ClerkContextValue>(() => ({
    user: mockUser,
    signOut: async (_options?: SignOutOptions) => {
      // Dev bypass: no-op sign out
    },
    addListener: (listener: ClerkListener) => {
      listeners.add(listener);
      // Immediately emit the current mock user so consumers can initialize
      listener({ user: mockUser });
      return () => { listeners.delete(listener); };
    },
  }), [listeners]);

  return <ClerkContext.Provider value={value}>{children}</ClerkContext.Provider>;
}

export function useClerk(): ClerkContextValue {
  return useContext(ClerkContext);
}

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}) {
  // Dev bypass: always treat the user as signed-in
  if (when === "signed-in") return <>{children}</>;
  return null;
}

interface SignInPageProps {
  routing?: string;
  path?: string;
  signUpUrl?: string;
}

export function SignIn(_props: SignInPageProps) {
  // Dev bypass: no sign-in UI, go straight to the room
  return <Redirect to="/room/chat" />;
}

interface SignUpPageProps {
  routing?: string;
  path?: string;
  signInUrl?: string;
}

export function SignUp(_props: SignUpPageProps) {
  return <Redirect to="/room/chat" />;
}
