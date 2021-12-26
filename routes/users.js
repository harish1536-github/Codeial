const express = require('express');
const router = express.Router();
//import passport
const passport=require('passport');
const usersController = require('../controllers/users_controller');

// router.get('/profile',passport.checkAuthentication, usersController.profile);
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);
// router.post('/create',usersConrtoller.create);
//sue passport as a middleware to authenticate
router.post('/create', usersController.create);

// use passport as a middleware to authenticate
//passport is a predefined function
router.post('/create-session', passport.authenticate(
    //strategy is local
    'local',
    //if session fails then redirect to sign-in page
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.post('/create-session',usersController.createSession);
router.get('/sign-out',usersController.destroySession);

// router.get('/outh/google',passport.authenticate('google',{scope:{'profile','email'}}))
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports = router;