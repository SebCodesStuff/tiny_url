let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//make modular

function generateRandomString() {
  let alphaNumeric =("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
  let randomStr = "";
  console.log(alphaNumeric.length);
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
  return urlDatabase[id];
}

//Create
function add(shortURL, longURL) {
  urlDatabase[shortURL]=longURL;
  return true;
}

// //Update
// function update(shortURL, editor) {
//   let urlExists = get(shortURL);
//   if (urlExists) {
//     urlDatabase[shortURL] = editor;
//     return true;
//   } else {
//     return false;
//   }
// }
//
// //Delete
// function delete (shortURL) {
//   if (!urlDatabase[shortURL]) {
//     return false;
//   }
//   urlDatabase = urlDatabase.filter((url, index) => {
//     return (id !== index);
//   });
//   return true;
// }
//


module.exports = {
  urlDatabase: urlDatabase,
  getAll: getAll,
  get: get,
  add: add,
  generateRandomString: generateRandomString,
  update: update,
  delete: delete
}
