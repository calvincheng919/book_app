'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express(); //instantiate an express object alled app
const PORT = process.env.PORT || 3000; //assign the dotenv port from .env file into PORT. Using OR operator as the fallback to 3000

// Application Middleware
app.use(express.urlencoded({extended:true})); //urlencoded is based on body-parser, which parses url encoded payloads
app.use(express.static('public')); //designate a folder for requrests from the client
app.use(express.static('public/styles')); //serve up css files

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

//create routes
app.get('/', newSearch); //get requests are sent and viewable on the url address line
app.post('/searches', performSearch); //post requests are embeded and not viewable in the adress line

// Catch-all
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

//express/node server is listening on specific port
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

function Book(info) {
  this.image_url = info.image_url || 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title || 'No title available';
}

function newSearch(request, response){
  response.render('pages/index');
}

function performSearch(request, response){
  console.log(request.body);
  console.log(request.body.search);
  let url = `https://www.googleapis.com/books/v1/volumes?q=+in${request.body.search[1]}:${request.body.search[0]}`;

  superagent.get(url)
    .then(apiResponse =>  apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(books => response.render('pages/searches/show', {searchResults: books}));
    // what if error? what do?
}
