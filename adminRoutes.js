const express = require('express');
const User = require('./mongooseServer.js');

const router = express.Router();

router.get('/admin', (req, res) => {

    if (req.query.username.toString() == "admin" ) {
        User.find({}, (err, users) => {
            if (err == null || error == undefined) {
                res.contentType("text/html");
                users.forEach((u) => {
                    res.write(`<p>${u.username}</p>`);
                    res.write(`<p>${u.phone}</p>`);
                    res.write(`<hr>`);
                    //res.write(`<p>${u.password}</p>`);
                }
                );
                //users = await JSON.stringify(users);
                res.end('<br>');
            }
            else {
                console.err(err.message);
                res.send('An Error has occured');
            }
        });

    }
    else {
        res.redirect('/user');
    }
});



// username (of current user), name (name of user to update), newname(new name for updated user), phone(of updated user)
router.put("/update", (req, res) => {
    console.log(req.query.name.toString());
    if (req.query.username.toString() == "admin" && req.query.name.toString()!="admin" ) {
        User.findOne({ username: req.query.name.toString() }, (er, user) => {
            console.error("hey" + er + ' ' + user);
            if(er!=null && er!= undefined)
            res.send('an Error has occured');

            else{

            user.username = req.query.newname.toString() || user.username;
            user.phone = parseInt(req.query.phone) || user.phone;
            user.save((err, data) => {
                if (err == null || err == undefined) {
                    res.send('updated successfully');
                }
                else {
                    console.error(err.message);
                    res.send('an Error has occured');
                }
            });
        }
    }
        );
    }
    else {
        res.redirect('/user');
    }

});

router.delete("/delete",(req,res)=>{
    if(req.query.username.toString()=="admin" && req.query.name.toString()!="admin")
    {
        console.log(req.query.username.toString() + ' ' + req.query.name.toString());
        User.deleteOne({username : req.query.name.toString()},(err)=>{
            if(err){
                console.error(err.message);
                res.send("An Error has occured");
            }
            else res.send("Deleted Successfully");
     
        });
    }
    else{
        res.redirect("/user");
    }
});

module.exports = router;