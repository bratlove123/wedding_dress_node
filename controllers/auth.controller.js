const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user.model');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const authService = require('../services/auth.service');

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  passReqToCallback: true,
  usernameField : 'userName',
  passwordField : 'password'
}, async (req, userName, password, done) => {
    try {
      UserModel.findOne({$or: [{'userName': userName}, {'email': req.body.email}]}, function(err, user){
        if(err){
          return done(err, false, { message : 'Got error when check user!'});
        }
        if(user){
          return done(null, false, { message : 'User already exists!'});
        }
        else{
          //Save the information provided by the user to the the database
          let newDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3);
          var user=new UserModel(
            {
              userName: req.body.userName,
              email: req.body.email,
              password: req.body.password,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              image: req.body.image,
              phone: req.body.phone,
              facebook: req.body.facebook,
              address: req.body.address,
              expiryTokenTime: newDate
            }
          );

          user.save(function(err){
            if(err){
              return done(err, false, { message : 'Got error when save user!'});
            }
            else{
              authService.sendEmailForActivate(user.email, user.emailConfirmToken);
              //Send the user information to the next middleware
              return done(null, user);
            }
          })
        }
      });
    } catch (error) {
      done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'userName',
  passwordField : 'password'
}, async (userName, password, done) => {
  try {
    //Find the user associated with the email provided by the user
    const user = await UserModel.findOne({ userName });
    if( !user ){
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found', code: 'USER_NOT_FOUND'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Wrong Password', code: 'WRONG_PASSWORD'});
    }
    const checkConfirmedEmail = await user.isConfirmedEmail();
    if(!checkConfirmedEmail){
      return done(null, false, { message : "Haven't confirm email", code: 'NOT_CONFIRM_EMAIL', email: user.email});
    }

    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'top_secret',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

module.exports = {
  activeAccount: function(req, res, next){
      UserModel.findOne({email: req.body.email}, function(err, user){
        if(err){
          next(err);
        }
        if(!user){
          next({status:401,message:'Cannot find user with this email!', data: null});
        }
        else{
          if(user.emailConfirmToken === req.body.code){
            if(user.expiryTokenTime >= new Date()){
              UserModel.update(user, {$set: {'isConfirmEmail': true}}, function(err, data){
                if(err){
                  next(err);
                }

                res.json({status:200,message:'Active user successfully!', data: null});
              })
            }
            else{
              next({status:401,message:'Token expired!', data: null});
            }
          }
          else{
            next({status:401,message:'Invalid Token!', data: null});
          }
        }
      });
  },

  sendEmailForgot: function(req, res, next){
    UserModel.findOne({email: req.body.email}, function(err, user){
      if(err){
        next(err);
      }
      if(!user){
        next({status:401,message:'Cannot find user with this email!', data: null});
      }
      else{
        let newDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3);
        UserModel.update(user, {'$set': {'expiryTokenTime': newDate}}, function(err, data){
          if(err){
            next(err);
          }

          authService.sendEmailForgotPass(req.body.email, user.emailConfirmToken);
          res.json({status:'success',message:'Send email reset password success!', data: null});
        });
      }
    });
  },

  sendEmailActive: function(req, res, next){
    UserModel.findOne({email: req.body.email}, function(err, user){
      if(err){
        next(err);
      }
      if(!user){
        next({status:401,message:'Cannot find user with this email!', data: null});
      }
      else{
        let newDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3);
        UserModel.update(user, {'$set': {'expiryTokenTime': newDate}}, function(err, data){
          if(err){
            next(err);
          }

          authService.sendEmailForActivate(req.body.email, user.emailConfirmToken);
          res.json({status:'success',message:'Send email active success!', data: null});
        });
      }
    });
  },

  resetPassword: function(req, res, next){
    UserModel.findOne({email: req.body.email}, function(err, user){
      if(err){
        next(err);
      }
      if(!user){
        next({status:401, message:'Cannot find user with this email!', data: null});
      }
      else{
        if(user.emailConfirmToken === req.body.code){
          if(user.expiryTokenTime >= new Date()){
            user.password = req.body.password;
            user.save();
            res.json({status:'success',message:'Reset password successfully!', data: null});
          }
          else{
            next({status:401, message:'Token expired!', data: null});
          }
        }
        else{
          next({status:401,message:'Invalid Token!', data: null});
        }
      }
    });
    
  }
}