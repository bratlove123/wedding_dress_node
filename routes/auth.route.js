const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();
const auth = require('../controllers/auth.controller');


//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', async (req, res, next) => {
  passport.authenticate('signup', { session : false },  async (err, user, info) => {
    try {
      if(err || !user){
        const error = {status: 401, message: info.message, code: info.code}
        return next(error);
      }

      res.json({ 
        message : 'Signup successful',
        user : req.user 
      });  
    } 
    catch (error) {
      return next(error);
    }
  })(req, res, next);
  
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {     
    try {
      if(err || !user){
        const error = {status: 401, message: info.message, code: info.code, email: info.email}
        return next(error);
      }
      req.login(user, { session : false }, async (error) => {
        if( error ) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id : user._id };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user : body },'top_secret');
        //Send back the token to the user
        return res.json({ token, userInfo: {
          fullName: user.firstName + ' ' + user.lastName,
          email: user.email,
          avatar: user.image,
          id: user._id,
          role: "Admin"
        } });
      });     
    } 
    catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/verify', auth.activeAccount);
router.post('/forgot', auth.sendEmailForgot);
router.post('/reset', auth.resetPassword);
router.post('/active', auth.sendEmailActive);

module.exports = router;