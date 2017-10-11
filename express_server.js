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

//When routing the app.get(first param) is the url that triggers the response
//the second part is where it goes



app.get("/", (req, res) => {
  res.end("Hello!");
});


//This is used to add the urlDatabase to url_index
app.get("/urls", (req, res) => {
  let urls = tinyDB.getAll();
  console.log(req.cookies)
  res.render('./pages/urls_index', {urls: urls, username: req.cookies.username})
});


// //This is used to post to urls_show. Generates a new page with my new url displayed

app.post("/show", (req, res) => {
  let shortURL = tinyDB.generateRandomString();
  let longURL = req.body.longURL
  tinyDB.add(tinyDB.urlDatabase, shortURL, longURL);
  // let urls = tinyDB.getAll();
  res.render('./pages/urls_show', {shortURL, longURL, username: req.cookies.username})
});

//Deletes a url
app.post("/urls/:id/delete", (req, res) => {
  delete tinyDB.urlDatabase[req.params.id];
  let urls = tinyDB.getAll();
res.render('./pages/urls_index', {urls: urls, username: req.cookies.username})
});


//Edits the file
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

//When I click on create a new short url it redirects here

app.get("/urls/new", (req, res) => {
  res.render("./pages/urls_new", {username: req.cookies.username}) ;
});
//

//.json is property of the express function check docs for more info
app.get("/urls.json", (req, res) => {
  res.json(tinyDB.urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
