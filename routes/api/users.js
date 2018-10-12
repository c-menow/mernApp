const express = require('express');
const router = express.Router();

// @route  GET api/users/test
// @desc  Tests users route
// @access  Public
//Llega aquí desde server.js -> app.use('/api/users', users):
router.get('/test', (req,res) => res.json({msg: "users works!! :D"}) );

module.exports = router;