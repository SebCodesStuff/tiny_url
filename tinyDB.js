let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {"userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }};

// make modular

function generateRandomString() {
  let alphaNumeric =("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
  let randomStr = "";
  for (let i = 0; i<6; i++) {
    randomStr += alphaNumeric[(Math.floor(Math.random()*62))]
  }
  return randomStr;
}

//Get all
function getAll() {
  return urlDatabase;
}


// Read
function get(id) {
  return urlDatabase[id]
}

//Create
function add(db, name, val) {
  db[name]=val;
  return true;
}

//Update
function update(shortURL, editor) {
  let urlExists = get(shortURL);
  if (urlExists) {
    urlDatabase[shortURL] = editor;
    return true;
  } else {
    return false;
  }
}

//Delete
function destroy (shortURL) {
  if (!urlDatabase[shortURL]) {
    return false;
  }
  urlDatabase = urlDatabase.filter((url, index) => {
    return (id !== index);
  });
  return true;
}



module.exports = {
  urlDatabase: urlDatabase,
  users: users,
  getAll: getAll,
  get: get,
  add: add,
  generateRandomString: generateRandomString,
  update: update,
  destroy: destroy
}
