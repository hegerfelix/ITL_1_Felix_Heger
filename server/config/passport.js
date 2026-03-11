const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret',
  issuer: process.env.JWT_ISSUER || 'accounts.itl1.com',
  audience: process.env.JWT_AUDIENCE || 'localhost'
};

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
