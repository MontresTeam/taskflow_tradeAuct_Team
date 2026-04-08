import passport from 'passport';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const MicrosoftStrategy = require('passport-microsoft').Strategy;
import { env } from '../../../config/env';
import { findOrCreateOAuthUser } from '../auth.service';

if (env.azureAdClientId && env.azureAdClientSecret) {
  passport.use(
    'microsoft-oauth',
    new MicrosoftStrategy(
      {
        clientID: env.azureAdClientId,
        clientSecret: env.azureAdClientSecret,
        callbackURL: env.microsoftOAuthCallbackUrl,
        tenant: env.azureAdTenantId || 'common',
        scope: ['user.read'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: {
          id: string;
          displayName?: string;
          emails?: { value: string }[];
          _json?: { mail?: string; userPrincipalName?: string; photo?: string };
        },
        done: (err: Error | null, user?: unknown) => void
      ) => {
        try {
          const email =
            profile.emails?.[0]?.value ?? profile._json?.mail ?? profile._json?.userPrincipalName;
          if (!email) return done(new Error('No email returned from Microsoft'), undefined);

          const user = await findOrCreateOAuthUser({
            provider: 'microsoft',
            providerId: profile.id,
            email,
            name: profile.displayName || email.split('@')[0],
            avatarUrl: profile._json?.photo ?? null,
          });
          return done(null, user as Parameters<typeof done>[1]);
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );
}
