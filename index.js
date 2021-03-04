//require('mongodb');
//require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
var bcrypt = require('bcryptjs');
const User = require('./mongooseServer.js');
app.use(express.json());



app.post("/user", (req, res, next) => {
    let data = req.body;
    console.log(data);
    // let username = data['username'];
    // let phone = data['phone'];
    let password = data['password'];
    const salt = 7;
    bcrypt.hash(password, salt, (err, hash) => {
        //console.log(err);
        if (err == null || err == undefined) {
            const newUser = new User({
                username: data['username'],
                phone: data['phone'],
                password: hash
            });
            newUser.save((er, data) => {
                if (er) {
                    err.statusCode = 422;
                    console.error(er.message);
                    res.send('An Error has Occured');
                }
                else {
                    res.status(200).send(data);
                }
            });
        }
        else {
            console.error(err.message);
            res.status(422).send("An Error Has occured");
        }
    });
});

app.get('/admin', (req, res) => {

    if (req.query.username.toString() == "admin") {
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

app.get("/GetUser", (req, res) => {
    uname = req.query.username.toString();
    User.findOne({ username: uname }, (err, data) => {
        if (err != null && err != undefined) {
            console.error(err.message);
            send('User Does not exist');
        }
        else {
            res.contentType("text/html");
            res.write(`<p>${data.username}</p>`);
            res.write(`<p>${data.phone}</p>`);
            res.end('<hr>');
        }
    });
});

// username (of current user), name (name of user to update), newname(new name for updated user), phone(of updated user)
app.put("/update", (req, res) => {
    console.log(req.query.name.toString());
    if (req.query.username.toString() == "admin") {
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

app.delete("/delete",(req,res)=>{
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


app.get("*", function (req, res) {
    res.status(404).send("not matched");
});

app.listen(port, () => {
    console.log('server runing');
})


