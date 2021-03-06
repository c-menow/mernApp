const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load User model:
const User = require('../../models/User');

// @route  GET api/users/test
// @desc  Tests users route
// @access  Public
//Llega aquí desde server.js -> app.use('/api/users', users):
router.get('/test', (req,res) => res.json({msg: "users works!! :D"}) );

// @route  GET api/users/test
// @desc   Register a user (first check if the email already exists)
// @access  Public
router.post('/register', (req,res) => {
   User.findOne({ email: req.body.email })
   .then( user => {
      if(user){
         return res.status(400).json({email: 'Email already exists.'});
      } else {
         const avatar = gravatar.url(req.body.email, {
            s: '200', // size
            r: 'pg', // rating
            d: 'mm' // default
         });

         // Create new user:
         const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar, // ES6- avatar:avatar same as avatar alone.
            password: req.body.password
         });

         // Encrypt password:
         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
               if(err) {throw err};
               newUser.password = hash;
               newUser.save()
               .then( user => {
                  res.json(user)
               })
               .catch(err => console.log(err))
            });
         });
      }
   })
});


// @route  GET api/users/login
// @desc   Login a user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
   const email = req.body.email;
   const password = req.body.password;

   //Find user by email:
   User.findOne({email})
   .then( user => {
      // Check for user
      if(!user) {
         return res.status(404).json({email: 'User not found'});
      }

      // Check Password
      bcrypt.compare(password, user.password)
      .then( isMatch => {
         if(isMatch){   
            // User matched - create JWT Payload:
            const payload = {
               id: user.id,
               name: user.name,
               avatar: user.avatar
            }
            // Sign Token
            jwt.sign(
               payload,
               keys.secretOrKey,
               { expiresIn: 3600 },
               (err,token) => {
                  res.json({
                     success: true,
                     token: 'Bearer ' + token
                  })
               });
         } else {
            return res.status(400).json({password: 'Incorrect password'})
         }
      })
   })
});


// @route  GET api/users/current
// @desc   Return current user
// @access  Private (it is unathorized without the token)
router.get('/current', 
   passport.authenticate('jwt', {session: false}), (req, res) => {
   res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
   });
});


//we export the router so server.js can pick it up:
module.exports = router;