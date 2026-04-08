import { Link, useSearchParams } from 'react-router-dom';

export default function OAuthError() {
  const [params] = useSearchParams();
  const reason = params.get('reason') ?? 'unknown';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">Sign-in failed</h1>
      <p className="text-sm text-[color:var(--text-muted)] text-center max-w-md">
        {reason === 'oauth_failed' && 'The identity provider rejected the sign-in or it was cancelled.'}
        {reason === 'no_user' && 'No user was returned from the provider.'}
        {reason !== 'oauth_failed' && reason !== 'no_user' && `Reason: ${reason}`}
      </p>
      <Link to="/login" className="text-sm text-[color:var(--accent)] hover:underline">
        Back to login
      </Link>
    </div>
  );
}
