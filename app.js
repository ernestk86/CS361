// File Name: app.js
// Author: Ernest Kim
// Date: 2.5.2020

var express = require('express');
var mysql = require('./dbcon.js');

var handlebars = require('express-handlebars').create({defaultLayout: 'main',});

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.use('/static', express.static('public'));
app.use('/modules', express.static('node_modules'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', 'http://web.engr.oregonstate.edu');
  res.append('Access-Control-Allow-Methods', 'GET,POST');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('mysql', mysql);

//NORMAL PAGE
app.get('/', function(req, res, next) {
  var context = {};
  context.jsscripts = ["delete.js"];

  //QUERY TO FILL RESOURCES TABLE
  mysql.pool.query('SELECT resource_id as id, resource_name FROM resource', function(err, rows, fields) {
    if(err) {
      next(err);
      return;
    }
    var parameters = [];
    for(var p in rows) {
       parameters.push({"id": rows[p].id, "resource_name": rows[p].resource_name});
    }
    context.resource = parameters;

    //QUERY TO FILL PRODUCTS TABLE
    mysql.pool.query('SELECT product_id as id, product_name FROM product', function(err, rows, fields) {
      if(err) {
        next(err);
        return;
      }
      var parameters = [];
      for(var p in rows) {
         parameters.push({"id": rows[p].id, "product_name": rows[p].product_name});
      }
      context.product = parameters;

      //QUERY TO FILL RECIPE TABLE
      mysql.pool.query('SELECT resource_product.resource_id, resource_product.product_id, product_name, resource_name, resource_quantity FROM resource_product JOIN resource ON resource_product.resource_Id = resource.resource_Id JOIN product ON resource_product.product_Id = product.product_Id', function(err, rows, fields) {
        if(err) {
          next(err);
          return;
        }
        var parameters = [];
        for(var p in rows) {
           parameters.push({"resource_product.resource_id": rows[p].rid, "resource_product.product_id": rows[p].pid, "product_name": rows[p].product_name, "resource_name": rows[p].resource_name, "resource_quantity": rows[p].resource_quantity});
        }
        context.resource_product = parameters;
        res.render('spike', context);
      });
    });
  });
});

app.get('/resource_add', function(req, res, next){
  res.render('resource_add');
});

app.post('/resource_add', urlencodedParser, function(req, res, next) {
  mysql.pool.query("INSERT INTO resource (resource_name) VALUES (?)", 
                   [req.body.resource_name], function(err, result) {
      if(err) {
        next(err);
        return;
      }
      res.redirect('/');
  });
});

app.get('/product_add', function(req, res, next){
  res.render('product_add');
});

app.post('/product_add', urlencodedParser, function(req, res, next) {
  mysql.pool.query("INSERT INTO product (product_name) VALUES (?)", 
                   [req.body.product_name], function(err, result) {
      if(err) {
        next(err);
        return;
      }
      res.redirect('/');
  });
});  

app.get('/resource_product_add', function(req, res, next){
  res.render('resource_product_add');
});

app.post('/resource_product_add', urlencodedParser, function(req, res, next) {
  mysql.pool.query("INSERT INTO resource_product (resource_id, product_id, resource_quantity) VALUES (?,?,?)", 
                   [req.body.resource_id, req.body.product_id, req.body.resource_quantity], function(err, result) {
      if(err) {
        next(err);
        return;
      }
      res.redirect('/');
  });
}); 

//DELETE QUERIES, LOOK AT delete.js
app.delete('/dr:id', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql;
  var inserts;
  sql = "DELETE FROM resource WHERE resource_id = ?";
  inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
          console.log(error)
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
      }else{
          res.status(202).end();
      }
  })
})

app.delete('/resource/:rid/product/:pid', function(req, res){
  console.log(req.params.resource_id)
  console.log(req.params.product_id)
  var mysql = req.app.get('mysql');
  var sql = "DELETE FROM resource_product WHERE resource_id = ? AND product_id = ?";
  var inserts = [req.params.resource_id, req.params.product_id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
      }else{
          res.status(202).end();
      }
  })
})

app.delete('/dp:id', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql;
  var inserts;
  sql = "DELETE FROM product WHERE product_id = ?";
  inserts = [req.params.id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
          console.log(error)
          res.write(JSON.stringify(error));
          res.status(400);
          res.end();
      }else{
          res.status(202).end();
      }
  })
})

app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});