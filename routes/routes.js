const express = require('express');
const router = express.Router();
const User = require('../models/user')


router.get('/signin',(req,res)=>{
    return res.render('signin')
})
router.get('/signup',(req,res)=>{
    return res.render('signup')
})
router.get('/about',(req,res)=>{
    return res.render('about')
})

router.post("/signup",async (req,res)=>{
    const{fullName,email,password} =req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    return res.redirect('/');
})
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);
    try {
       
        const user = await User.matchPassword(email, password);

        if (!user) {
            
            console.log("Invalid email or password");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Authenticated user:", user);
        return res.redirect("/");
    } catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports=router;