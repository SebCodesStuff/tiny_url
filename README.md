# TinyApp Project

Welcome to TinyApp version 1.0.0! This is the skeleton of the project and hopefully I'll have some time later to add some css to the project, add a bit of functionality and it could use a pretty serious refactoring. That being said it's mostly complete.

The app is built with Node and express and allows users to shorten URLs.

As far as I can tell there's one single bug (likely more if you really look), when you add your URL you have to add the full protocol in front of the url or else you will not be properly redirected.

It's important to note when going through the project that both databases, and all modular functions are strored in the tinyDB file.

![ "The first screen shot is of my index page. Here are all a user's short URL's are displayed in a list.""](https://github.com/SebCodesStuff/tiny_url/blob/master/docs/Index.png?raw=true)

!["The second screen shot is the edit page that allows you to change a what a short URL directs to."](https://github.com/SebCodesStuff/tiny_url/blob/master/docs/edit-page.png?raw=true)


## Dependencies
 -  "bcrypt": "^1.0.3",
 -  "body-parser": "^1.18.2",
 -  "cookie-session": "^2.0.0-beta.3",
 -  "ejs": "^2.5.7",
 -  "express": "^4.16.2",
 -  "request": "^2.83.0"

 ## Getting Started

 -  Install all dependencies using "npm install" command
 -  Run the development web server using "node express_server.js" command
