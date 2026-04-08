import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { env } from '../../../config/env';
import { findOrCreateOAuthUser } from '../auth.service';

if (env.googleClientId && env.googleClientSecret) {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email returned from Google'), undefined);

          const user = await findOrCreateOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email,
            name: profile.displayName || email.split('@')[0],
            avatarUrl: profile.photos?.[0]?.value ?? null,
          });
          return done(null, user as Parameters<typeof done>[1]);
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );
}
