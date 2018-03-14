import passport from 'passport'
import {
  ExtractJwt,
  Strategy as JWTStrategy
} from 'passport-jwt'

export const jwtOpts = {
  issuer: process.env.API_PASSPORT_JWT_ISSUER || '',
  algorithm: process.env.API_PASSPORT_JWT_ALGORITHM || '',
  expiry: process.env.API_PASSPORT_JWT_EXPIRATION || ''
}

export default () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.API_PASSPORT_JWT_SECRET || '',
    issuer: process.env.PASSPORT_JWT_ISSUER || '',
    algorithms: [process.env.API_PASSPORT_JWT_ALGORITHM],
    passReqToCallback: true
  }

  passport.use(new JWTStrategy(opts, (req, payload, done) => {
    if (jwtOpts.verify) {
      jwtOpts.verify(req, payload, done)
    }
  }))

  return {
    handler: () => passport.authenticate('jwt', {
      session: false
    })
  }
}
