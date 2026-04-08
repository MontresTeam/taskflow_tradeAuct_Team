import express from 'express';
import passport from 'passport';
import { env } from '../../config/env';
import { oauthSuccessHandler, oauthFailureHandler } from './oauth.controller';
import './strategies/google.strategy';
import './strategies/microsoftOAuth.strategy';

const router = express.Router();

const feFail = `${env.frontendUrl}/auth/error?reason=oauth_failed`;

if (env.googleClientId && env.googleClientSecret) {
  router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: feFail }),
    oauthSuccessHandler
  );
}

if (env.azureAdClientId && env.azureAdClientSecret) {
  router.get('/microsoft', passport.authenticate('microsoft-oauth', { session: false }));
  router.get(
    '/microsoft/callback',
    passport.authenticate('microsoft-oauth', { session: false, failureRedirect: feFail }),
    oauthSuccessHandler
  );
}

router.get('/failed', oauthFailureHandler);

export const oauthRoutes = router;
