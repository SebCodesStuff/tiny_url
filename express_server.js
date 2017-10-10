var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine',"ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});
console.log(urlDatabase);

//This is used to add the urlDatabase to url_index
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};
  res.render('./pages/urls_index', templateVars)
})

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
