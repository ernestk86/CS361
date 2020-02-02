// File Name: app.js
// Author: Ernest Kim
// Date: 2.1.2020

var express = require('express');
var mysql = require('./dbcon.js');

var handlebars = require('express-handlebars').create({defaultLayout: 'main',});

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//app.set('port', 7374);

app.use('/static', express.static('public'));
app.use('/modules', express.static('node_modules'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', 'https://remotemysql.com:3306');
  res.append('Access-Control-Allow-Methods', 'GET,POST');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('mysql', mysql);

app.get('/', function(req, res) {
  var context = {};
  context.active = { home: true };
  res.render("home", context);
});

app.use('/driver', require('./driver.js'));

app.get('/driver_edit', function(req, res) {
  res.render("driver_edit");
});

app.get('/driver_search', function(req, res) {
  res.render("driver_search");
});

app.use('/race', require('./race.js'));

app.get('/race_edit', function(req, res) {
  res.render("race_edit");
});

app.get('/team_edit', function(req, res) {
  res.render("team_edit");
});

app.get('/track_edit', function(req, res) {
  res.render("track_edit")
});

app.get('/vehicle_edit', function(req, res) {
  res.render("vehicle_edit");
});

app.get('/contact', function(req, res) {
  var context = {};
  context.active = { contact: true };
  res.render("contact", context);
});

app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

/*app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
*/