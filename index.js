    const express = require('express');
    const path =require('path')
    const app = express();
    const userRoutes =require("./routes/routes")
    const mongoose =require("mongoose");

    const PORT =5423;

    mongoose
    .connect('mongodb://127.0.0.1:27017/blogify')
    .then(() => {
        console.log('MongoDB connected!!!');
    })
    .catch((e) => {
        console.log('MongoDB connection error:', e.message);
    });


    app.use(express.json());
    app.use(express.urlencoded({extended:false}));

    app.set('view engine', 'ejs');
    app.set('views',path.resolve('./views') )


    app.get('/',(req,res)=>{
            return res.render('home')
    })
    app.use('/user',userRoutes);


    app.listen(PORT,()=>{
        console.log(`Server running at http://localhost:${PORT}`);
    })