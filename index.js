//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000


const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');


// Mongoose

mongoose.connect('mongodb://localhost:27017/secrets', {useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET
console.log(secret)



const User = mongoose.model('User', userSchema)


app.get('/', (req, res) => {
  res.render("home")
})

app.get('/login', (req, res) => {
  res.render("login")
})

app.get('/register', (req, res) => {
  res.render("register")
})

app.get('/secrets', (req, res) => {
  res.render("secrets")
})

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    
    newUser.save(function (err) {
    (err) ? 
    console.log(err) : 
    res.render("secrets")
  });
})

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;


User.findOne({email: username}, (err, foundUser)=>{
    if (err) {
        console.log(err);
    }else{
        if (foundUser){
            if (foundUser.password === password){
                res.render("secrets");
            }
        }
    }

})
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})