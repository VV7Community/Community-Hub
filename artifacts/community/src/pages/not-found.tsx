import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-mono">404</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link href="/" className="inline-block mt-4 text-primary hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}