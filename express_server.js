const express = require("express");
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')
const app = express();

const bcrypt = require('bcrypt');

let tinyDB = require('./tinyDB');

app.use(bodyParser.urlencoded({extended: true}));
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine',"ejs");


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
    res.render('./pages/login', {userID: null});
  } else {
    res.redirect('/urls');
  }
});

app.get("/login", (req, res) => {
  res.render('./pages/login', {userID: null});
})
//A register endpoint with a form, if logged in redirect

app.get("/register", (req, res) => {
  res.render('./pages/register')
});

app.get("/urls", (req, res) => {
  if (!tinyDB.users[req.session.userID]) {
    res.status(401).send("401: Must be logged in to view this page. Please login or register.");
    return;
  } else {
    console.log("inside root if statement", tinyDB.urlsForUser(req.session.userID));
      let urls = tinyDB.urlsForUser(req.session.userID);
      console.log(urls);
      let userID = tinyDB.users[req.session.userID].id;
      res.render('./pages/urls_index', {urls: urls, userID: userID})
    }
  });


//This is my redirecter
app.get("/u/:shortURL", (req, res) => {
  console.log(res.status(302));
  let longURL = tinyDB.urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//When I click on create a new short url it redirects here

app.get("/urls/:id", (req, res) => {
  let urls = tinyDB.getAll();
  if (!tinyDB.users[req.session.userID]) {
    res.render('./pages/register', {urls: urls, userID : null})
  } else {
    let userID = tinyDB.users[req.session.userID].id;
    res.render('./pages/urls_new', {urls: req.params.id, userID: userID})
  }
});
//

//.json is property of the express function check docs for more info
app.get("/urls.json", (req, res) => {
  res.json(tinyDB.urlDatabase);
});

//Post should redirect to the urls/id page
app.post("/urls", (req, res) => {
  let shortURL = tinyDB.generateRandomString();
  let longURL = req.body.longURL;
  let user = req.session.userID;
  tinyDB.urlDatabase[shortURL]={[shortURL]: longURL, userID: user}
  let urls = tinyDB.urlsForUser(req.session.userID);
  res.render('./pages/urls_index', {urls: urls, shortURL: shortURL, longURL: longURL, userID: tinyDB.users[req.session.userID]})
});

//post/urls/id
//updates

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
    console.log(tinyDB.userID);
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
// Convert the below to an edit page


// app.post("/show", (req, res) => {
//   let shortURL = tinyDB.generateRandomString();
//   let longURL = req.body.longURL;
//   let user = req.session.userID;
//   tinyDB.urlDatabase[shortURL]={[shortURL]: longURL, userID: user}
//   let urls = tinyDB.getAll();
//   res.render('./pages/urls_show', {shortURL: shortURL, longURL: longURL, userID: tinyDB.users[req.session.userID]})
// });

//Deletes a url when I delet my url it shows other stuff
app.post("/urls/:id/delete", (req, res) => {
  delete tinyDB.urlDatabase[req.params.id];
  let urls = tinyDB.getAll();
res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.session.userID]})
});


//Edits the file this is the urls/:id post that they want jsut need to remove edit and make sure everything routes
app.post("/urls/:id", (req, res) => {
  //If you aren't the user that owns the url this page egisterbreaks
  let shortURL = req.body.shortURL;
  console.log(tinyDB.users[req.session.userID]);
  if (tinyDB.users[req.session.userID].id !== tinyDB.urlDatabase[req.params.id].userID) {
    res.status(401).send("401: You cannot edit this url it belongs to another user");
    return;
  } else {
    // req.body.shortURL is the longURL
    // req.params.id is the shortURL
    tinyDB.urlDatabase[req.params.id]={[req.params.id]: req.body.shortURL, userID:tinyDB.users[req.session.userID].id }
    // tinyDB.update(req.params.id, req.body.shortURL)
    let urls = tinyDB.urlsForUser(req.session.userID);
    res.render('./pages/urls_index', {urls: urls, userID: tinyDB.users[req.session.userID]})
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
