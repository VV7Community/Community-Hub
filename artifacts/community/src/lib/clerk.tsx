// Conditional Clerk adapter: uses a hardcoded dev bypass when VITE_DEV_AUTH_BYPASS is
// set to "true", otherwise re-exports the real @clerk/react components. This keeps the
// app functional while VectorVest sets up their Clerk/production auth, but prevents
// the bypass from silently applying in production builds.

import {
  ClerkProvider as RealClerkProvider,
  SignIn as RealSignIn,
  SignUp as RealSignUp,
  Show as RealShow,
  useClerk as useRealClerk,
} from '@clerk/react';
import {
  ClerkProvider as MockClerkProvider,
  SignIn as MockSignIn,
  SignUp as MockSignUp,
  Show as MockShow,
  useClerk as useMockClerk,
} from './clerk-mock';

export const bypassEnabled = import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';

export const ClerkProvider = (bypassEnabled ? MockClerkProvider : RealClerkProvider) as typeof RealClerkProvider;
export const SignIn = (bypassEnabled ? MockSignIn : RealSignIn) as typeof RealSignIn;
export const SignUp = (bypassEnabled ? MockSignUp : RealSignUp) as typeof RealSignUp;
export const Show = (bypassEnabled ? MockShow : RealShow) as typeof RealShow;
export const useClerk = (bypassEnabled ? useMockClerk : useRealClerk) as typeof useRealClerk;
