const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')



module.exports = {
  google: function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'

      },
      async(accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
        }
        try {
          let user = await User.findOne({ googleId: profile.id })
          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }));
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => done(err, user));
    })
  },
  facebook: function(passport) {
    passport.use(new FacebookStrategy({
        clientID: process.env.facebookAuth_clientID,
        clientSecret: process.env.facebookAuth_clientSecret,
        callbackURL: '/auth/facebook/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile)
          //return done(null, profile);
      }));
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => done(err, user));
    })
  }
}