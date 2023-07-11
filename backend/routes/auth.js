const express = require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Samratisagoodb$oy';

//Create a user usig POST /api/auth/createuser
router.post('/createuser',[
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
],async (req,res)=>{
  let success=false;
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({success, errors:errors.array()})
  }
  try{
    let user = await User.findOne({email: req.body.email });
    if(user){
      return res.status(400).json({success,error: "Sorry a user with this email alresdy exists"});
    }  
    success=true;
    const salt=await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    console.log(req.body);
    user= await User.create({
    name:req.body.name,
    email:req.body.email,
    password:secPass,
    pic:req.body.pic
  });
  const data={
    user:{
      id: user.id
    }
  }
  const authtoken=jwt.sign(data, JWT_SECRET);
  res.json({success,authtoken})
}catch(error)
{
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({success, error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 3: Get User Details
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/find?', fetchuser, async(req,res)=>{
  const keyword=req.query.search?{
    $or:[
      {name:{$regex:req.query.search,$options:"i"}},
      {email:{$regex:req.query.search,$options:"i"}},
    ]}
    :{};
    const users=await User.find(keyword).find({_id:{$ne: req.user.id}});

    res.send(users)
  });

module.exports=router