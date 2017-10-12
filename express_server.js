const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

let tinyDB = require('./tinyDB');

app.use(bodyParser.urlencoded({extended: true}));
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine',"ejs");
app.use(cookieParser());

// The order of our routing is important. Express goes through these in order and stops at the first case
//that matches

//When routing the app.get(first param) is the url that triggers the response
//the second part is where it goes


//This is used to add the urlDatabase to url_index
//Passes in an object to the header..... why would we do that
app.get("/", (req, res) => {
  let urls = tinyDB.getAll();
  res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.cookies.userID]})
});

//A register endpoint with a form

app.get("/register", (req, res) => {
  res.render('./pages/register')
});

//This is my redirecter
app.get("/u/:shortURL", (req, res) => {
  console.log(res.status(302));
  let longURL = tinyDB.urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//When I click on create a new short url it redirects here

app.get("/urls/new", (req, res) => {
  res.render("./pages/urls_new", {userID: tinyDB.users[req.cookies.userID]}) ;
});
//

//.json is property of the express function check docs for more info
app.get("/urls.json", (req, res) => {
  res.json(tinyDB.urlDatabase);
});

app.get("/login", (req, res) => {
  res.render("./pages/login", {userID: tinyDB.users[req.cookies.userID]})
})


app.post("/register", (req, res) => {
//If I ever have an error make this var instead of let
  let availableEmail = true;

  //this checks to make sure my email or password section isn't empty
  if (req.body.email === "" || req.body.password === "") {
    console.log("User not created. Password or Email is empty");
  } else {
    //This checks to see if the email exists done as en alse that way I don't have to
    // add the render part to each and every conditional. That being said if I can't figure out
    // how to alert then maybe I should send it different error pages
    for (let id in tinyDB.users) {
      if (tinyDB.users[id].email === req.body.email) {
        console.log("User not created. This email is already registered to an account");
        availableEmail = false;
      }
    };
    //If both of the conditions above are false made possible by the availableEmail var
    //we execute this block that makes a user
    if (availableEmail === true) {
      const randomID = tinyDB.generateRandomString();
      res.cookie("userID", randomID)
      tinyDB.users[randomID] = {
          id: randomID,
          email: req.body.email,
          password: req.body.password
      }
    }
  }
  let urls = tinyDB.getAll();
  res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.cookies.userID]})
})

//This is my login form response, creates a cookie and adds the
//username to an object
app.post("/login", (req, res) => {
  for (user in tinyDB.users) {
    if (tinyDB.users[user].email === req.body.email & tinyDB.users[user].password === req.body.password) {
      res.cookie("userID", tinyDB.users[user].id)
    }
  }
  let urls = tinyDB.getAll();
  res.render('./pages/urls_index', {userID: tinyDB.users[req.cookies.userID], urls: urls})
});

// //This is used to post to urls_show. Generates a new page with my new url displayed

app.post("/show", (req, res) => {
  let shortURL = tinyDB.generateRandomString();
  let longURL = req.body.longURL
  tinyDB.add(tinyDB.urlDatabase, shortURL, longURL);
  // let urls = tinyDB.getAll();
  res.render('./pages/urls_show', {shortURL, longURL, userID: tinyDB.users[req.cookies.userID]})
});

//Deletes a url
app.post("/urls/:id/delete", (req, res) => {
  delete tinyDB.urlDatabase[req.params.id];
  let urls = tinyDB.getAll();
res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.cookies.userID]})
});


//Edits the file
app.post("/urls/:id/edit", (req, res) => {
  // console.log(res.body.shortURL);
  tinyDB.update(req.params.id, req.body.shortURL)
  let urls = tinyDB.getAll();
  res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.cookies.userID]})
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
