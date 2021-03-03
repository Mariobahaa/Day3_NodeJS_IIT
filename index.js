//require('mongodb');
require('mongoose');
const express= require('express');
const app=express();
require("./mongooseServer");
const port=3000;
var bcrypt = require('bcryptjs');
const User = require('./mongooseServer');
app.use(express.json());


app.post("/user",(req,res,next)=>{
    let data = req.body;
    console.log(data);
    // let username = data['username'];
    // let phone = data['phone'];
    let password = data['password'];
    const salt = 7;
    bcrypt.hash(password,salt,(err,hash)=>
    {
        //console.log(err);
        if(err==null || err==undefined){
            const newUser = new User({
                username : data['username'],
                phone : data['phone'],
                password : hash
            });
            newUser.save((err,data)=>{
                if(err){
                err.statusCode=422;
                next(err);      
            }
            else{
                res.status(200).send(data);
            }});
        }
    });
     
    //res.send('');
});

app.get("*", function (req, res) {
    res.status(404).send("not matched");  
});

app.listen(port,()=>{
    console.log('server runing');
})


