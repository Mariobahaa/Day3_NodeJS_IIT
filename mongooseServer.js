
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mariodb', 
{useNewUrlParser: true, useUnifiedTopology: true});

const userSchema =  new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User=mongoose.model("User",userSchema);
/*User.on("index",(err)=>{
    console.log(err);
})*/
module.exports=User;