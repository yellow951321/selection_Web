const express =require('express');
const router = express.Router();

var sessionTable = require('./')

router.get('/',(req,res)=>{
  res.render('login');
});





module.exports = router;