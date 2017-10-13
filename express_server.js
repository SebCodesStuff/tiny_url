const express = require("express");
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')
const app = express();

const bcrypt = require('bcrypt');

let tinyDB = require('./tinyDB');

app.use(bodyParser.urlencoded({extended: true}));
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine',"ejs");

app.get("/login", (req, res) => {
  res.render("./pages/login")
})

app.use(cookieSession({
  name: 'session',
  keys: ['userID']
}));

// The order of our routing is important. Express goes through these in order and stops at the first case
//that matches

//When routing the app.get(first param) is the url that triggers the response
//the second part is where it goes


///Make a filter function that narrows down my urls


//This is used to add the urlDatabase to url_index

app.get("/", (req, res) => {
  if (!tinyDB.users[req.session.userID]) {
    console.log("displaying user info", req.session.userID);
    console.log(tinyDB.users);
    res.render('./pages/urls_index', {urls: null, userID : null})
  } else {
    console.log("inside root if statement", tinyDB.users);
      let urls = tinyDB.urlsForUser(req.session.userID);
      let userID = tinyDB.users[req.session.userID].id;
      res.render('./pages/urls_index', {urls: urls, userID: userID})
    }
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
  let urls = tinyDB.getAll();
  if (!tinyDB.users[req.session.userID]) {
    res.render('./pages/register', {urls: urls, userID : null})
  } else {
    let userID = tinyDB.users[req.session.userID].id;
    res.render('./pages/urls_new', {urls: urls, userID: userID})
  }
});
//

//.json is property of the express function check docs for more info
app.get("/urls.json", (req, res) => {
  res.json(tinyDB.urlDatabase);
});

app.get("/login", (req, res) => {
  res.render("./pages/login")
})

app.post("/", (req, res) => {
  let urls = tinyDB.urlsForUser(req.session.userID);
  let userID = tinyDB.users[req.session.userID].id;
  res.render('./pages/urls_index', {urls: urls, userID: userID})
});

app.post("/logout", (req, res) => {
  req.session = null;//res.clearCookie("/")
  let urls = tinyDB.getAll();
  res.render('./pages/urls_index', {urls: null, userID : null})
});

// *********************************************************************************************************

app.post("/register", (req, res) => {
//If I ever have an error make this var instead of let
  let availableEmail = true;

  //this checks to make sure my email or password section isn't empty
  if (req.body.email === "" || req.body.password === "") {
    res.status(403).send("User not created. Password or Email is empty");
    return;
  } else {
    //This checks to see if the email exists done as en alse that way I don't have to
    // add the render part to each and every conditional. That being said if I can't figure out
    // how to alert then maybe I should send it different error pages
    for (let id in tinyDB.users) {
      if (tinyDB.users[id].email === req.body.email) {
        availableEmail = false;
        res.status(403).send("User not created. This email is already registered to an account");
        return;
      }
    };
    //If both of the conditions above are false made possible by the availableEmail var
    //we execute this block that makes a user
    if (availableEmail === true) {
      let password = req.body.password;
      const randomID = tinyDB.generateRandomString();
      let hashedPassword = bcrypt.hashSync(password,10);
      req.session.userID = randomID;
      tinyDB.users[randomID] = {
          id: randomID,
          email: req.body.email,
          password: hashedPassword
      }
    }
    let urls = tinyDB.urlsForUser(req.session.userID);
    res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.session.userID]})
  }
});

// *****************************************************************************************************************


//This is my login form response, creates a cookie and adds the
// userID to an object
app.post("/login", (req, res) => {
  let registeredUser = false;
  for (user in tinyDB.users) {
    let password = tinyDB.users[user].password;
    console.log("my email", tinyDB.users[user].email, "&",req.body.email);
    console.log(req.body.password, "&", password);
    console.log(bcrypt.compareSync(req.body.password, password));
    // My encryptor isn't working anymore
    if (tinyDB.users[user].email === req.body.email && bcrypt.compareSync(req.body.password, password)) {
      req.session.userID = tinyDB.users[user].id;
      // req.session("userID", tinyDB.users[user].id)
      registeredUser = true;
    }
  }
  if (registeredUser === false) {
    res.status(403).send("403: Your username and password did not match a registered user. Try again or register.");
    return;
  } else {
    let urls = tinyDB.urlsForUser(req.session.userID);
    res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.session.userID]})
    res.render('./pages/urls_index', {userID: tinyDB.users[req.session.userID], urls: urls})
  }
});

// //This is used to post to urls_show. Generates a new page with my new url displayed

app.post("/show", (req, res) => {
  let shortURL = tinyDB.generateRandomString();
  let longURL = req.body.longURL
  tinyDB.add(tinyDB.urlDatabase, shortURL, longURL);
  // let urls = tinyDB.getAll();
  res.render('./pages/urls_show', {shortURL, longURL, userID: tinyDB.users[req.session.userID]})
});

//Deletes a url
app.post("/urls/:id/delete", (req, res) => {
  delete tinyDB.urlDatabase[req.params.id];
  let urls = tinyDB.getAll();
res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.session.userID]})
});


//Edits the file
app.post("/urls/:id/edit", (req, res) => {
  //If you aren't the user that owns the url this page egisterbreaks
  if (tinyDB.users[req.session.userID].id !== tinyDB.urlDatabase[req.params.id].userID) {
    res.status(403).send("403: You cannot delete this url it belongs to another user");
    return;
  } else {
    tinyDB.update(req.params.id, req.body.shortURL)
    let urls = tinyDB.getAll();
    res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.session.userID]})
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
