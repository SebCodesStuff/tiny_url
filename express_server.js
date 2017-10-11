const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

let tinyDB = require('./tinyDB');

app.use(bodyParser.urlencoded({extended: true}));
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine',"ejs");
app.use(cookieParser())

// The order of our routing is important. Express goes through these in order and stops at the first case
//that matches


app.get("/", (req, res) => {
  res.end("Hello!");
});


//This is used to add the urlDatabase to url_index
app.get("/urls", (req, res) => {
  let urls = tinyDB.getAll();
  console.log(req.cookies)
  res.render('./pages/urls_index', {urls: urls, username: req.cookies.username})
});


//Within /url/new creates a new url

app.post("/urls", (req, res) => {
  let shortURL = tinyDB.generateRandomString();
  let longURL = req.body.longURL
  tinyDB.add(tinyDB.urlDatabase, shortURL, longURL);
  // let urls = tinyDB.getAll();
  res.render('./pages/urls_show', {shortURL, longURL, username: req.cookies.username})
});


app.post("/urls/:id/delete", (req, res) => {
  delete tinyDB.urlDatabase[req.params.id];
  let urls = tinyDB.getAll();
res.render('./pages/urls_index', {urls: urls, username: req.cookies.username})
});

app.post("/urls/:id/edit", (req, res) => {
  // console.log(res.body.shortURL);
  tinyDB.update(req.params.id, req.body.shortURL)
  let urls = tinyDB.getAll();
  res.render('./pages/urls_index', {urls: urls, username: req.cookies.username})
});


//This is my login form response, creates a cookie and adds the
//username to an object
app.post("/login", (req, res) => {
  res.cookie("username" ,req.body.username, {expires: new Date(Date.now() + 900000)})
  let urls = tinyDB.getAll();
  res.render('./pages/urls_index', {username: req.cookies.username, urls: urls})
});

//This is my redirecter
app.get("/u/:shortURL", (req, res) => {
  console.log(res.status(302));
  let longURL = tinyDB.urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  res.render("./pages/urls_new", {username: req.cookies.username}) ;
});
//
// //This is used to write to urls_show, when accessing longURL it must be done in [] notation
// //This is because if you do dot notation it's like you are navigating through the object
// //and urlDatabase does not contain a property called req. [] notation however accesses a property
// //matching the value you enter
//
//
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: tinyDB.urlDatabase[req.params.id], username: req.cookies.username};
  res.render("./pages/urls_show", templateVars);
});


//.json is property of the express function check docs for more info
app.get("/urls.json", (req, res) => {
  res.json(tinyDB.urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
