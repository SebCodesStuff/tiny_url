const express = require("express");
const app = express();
const bodyParser = require("body-parser");

function generateRandomString() {
  let alphaNumeric =("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
  let randomStr = "";
  console.log(alphaNumeric.length);
  for (let i = 0; i<6; i++) {
    randomStr += alphaNumeric[(Math.floor(Math.random()*62))]
    console.log(Math.floor(Math.random()*62));
  }
  return randomStr;
}

app.use(bodyParser.urlencoded({extended: true}));
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine',"ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// The order of our routing is important. Express goes through these in order and stops at the first case
//that matches


app.get("/", (req, res) => {
  res.end("Hello!");
});
console.log(urlDatabase);

//This is used to add the urlDatabase to url_index
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};
  res.render('./pages/urls_index', templateVars)
})

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("./pages/urls_new");
});

//This is used to write to urls_show, when accessing longURL it must be done in [] notation
//This is because if you do dot notation it's like you are navigating through the object
//and urlDatabase does not contain a property called req. [] notation however accesses a property
//matching the value you enter
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("./pages/urls_show", templateVars);
});

//.json is property of the express function check docs for more info
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//<% for (myURL in shortURL) {%> <%=myURL %> <% } %>
