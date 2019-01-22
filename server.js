const express = require('express');
const hbs = require('hbs');
const fs = require('fs');              // Going to write middleware output to file

// port for app (Heroku)
const port = process.env.PORT || 3000;

// Make a new express app
let app = express();


// We want to add support for partials:
hbs.registerPartials(__dirname + '/views/partials/')    // __dirname stores path to proj. directory
// lets you set various express related configurations
app.set('view engine', 'hbs');

// app.use is how you register middleware
// Middleware to track how the server is working

app.use((req, res, next) => {               // next is used to tell when your middleware function is done
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
    console.log('Unable to write to server.log!');
    }
  })
  next();
});

// Maintenance page
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'))
// Helpers allow you to run some code from .hbs (html) files
// Use a helper to get date (year) for footer.hbs
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// This is a helper that takes arguments
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// HTTP route handlers
// Register a handler with app.get
// req: request
// res: response
app.get('/', (req, res) => {
  //res.send('Hello Express');
  res.render('home.hbs',{
    name: 'Alaaddin',
    height: '250',
    likes: [
      'bikes',
      'snowboarding',
      'code'
    ],
    pageName: 'Home'
  });
});

// Projects page
app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'projects Page',
    pageName: 'Projects'
  });                                  // static page rendering (render tied to view engine)
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    pageName: 'About us'
  });                                  // static page rendering (render tied to view engine)
});

app.get('/bad', (req, res) => {
  res.send({
    STATUS_CODE: '6969420',
    ERROR_MESSAGE: 'Unable to fulfill this request'
  });
});


app.listen(port, () => {
  console.log(`server is up on port ${port}`)
});
