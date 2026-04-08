/**
 * @file config/passport.js
 * @description Konfiguriert die Passport JWT-Strategie für zustandslose Authentifizierung.
 * JWTs werden aus dem Authorization-Header (Bearer-Schema) extrahiert und
 * mit dem gemeinsamen Secret verifiziert.
 *
 * Kursanforderung Teil 2: Backend-Routinen mit JWT/Passport
 */

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models');
require('dotenv').config();

// JWT-Strategie-Optionen:
// - fromAuthHeaderAsBearerToken(): erwartet "Authorization: Bearer <token>" im HTTP-Header
// - secretOrKey: muss mit dem Secret in routes/auth.js übereinstimmen (zum Signieren verwendet)
// - issuer/audience: zusätzliche Claims-Validierung verhindert Token-Missbrauch aus anderen Systemen
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret',
  issuer: process.env.JWT_ISSUER || 'accounts.itl1.com',
  audience: process.env.JWT_AUDIENCE || 'localhost'
};

// Verify-Callback: wird nach erfolgreicher Token-Signatur-Verifikation aufgerufen.
// jwt_payload enthält die im Token kodierten Daten ({ id, email }).
// Der User wird aus der DB geladen, um sicherzustellen, dass er noch existiert
// (gelöschte User können sich damit nicht mehr mit alten Tokens anmelden).
// done(null, user)  → Authentifizierung erfolgreich, user wird in req.user gesetzt
// done(null, false) → Token gültig, aber User nicht gefunden → 401
// done(error, false)→ DB-Fehler → 500
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id);
    if (user) {
      return done(null, user.toSafeObject());
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = { passport, JWT_SECRET: process.env.JWT_SECRET };
