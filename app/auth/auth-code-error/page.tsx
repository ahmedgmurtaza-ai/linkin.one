export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        <p className="text-muted-foreground mb-4">
          Sorry, we couldn't authenticate you. Please try logging in again.
        </p>
        <a href="/login" className="text-primary underline">
          Back to Login
        </a>
      </div>
    </div>
  );
}
