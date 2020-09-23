const express = require('express');
const Controller = require('../controllers/Controller');
const Socket_ctr = require('../controllers/Socket_ctr');
const router = express.Router();

// get
router.get('/', Controller.index);
router.get('/login', Controller.login_g);
router.get('/logout', Controller.logout_g);
router.get('/signup', Controller.signup_g);
router.get('/chat_main',Socket_ctr.chat_main);
router.get('/chat_main/:id', Socket_ctr.chat)

//post
router.post('/login', Controller.login_p);
router.post('/signup', Controller.signup_p);
router.post ('/mk_room', Socket_ctr.mk_room);

module.exports = router;