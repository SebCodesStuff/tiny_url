let urlDatabase =
{"b2xVn2":{
  b2xVn2: "http://www.lighthouselabs.ca",
  userID : "userRandomID"},
"9sm5xK": {
  "9sm5xK": "http://www.google.com",
  userID: "userRandomID"}};

// console.log(urlDatabase["9sm5xK"].userID);

let users = {"userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  }};
  //
  // for (user in users) {
  //   if(users[user].email === "user@example.com" )
  //   console.log(users[user].email+"works");
  // }


function generateRandomString() {
  let alphaNumeric =("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
  let randomStr = "";
  for (let i = 0; i<6; i++) {
    randomStr += alphaNumeric[(Math.floor(Math.random()*62))]
  }
  return randomStr;
}

///Start below need to figure out how to pull both parts

//Get all
function getAll() {
  for(key in urlDatabase) {
  return  urlDatabase;
  }
}

getAll()

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
    urlDatabase[shortURL][shortURL] = editor;
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
