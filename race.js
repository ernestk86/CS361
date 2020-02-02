module.exports = function() {
  var express = require('express');
  var router = express.Router();

  function getRaces(res, mysql, context, complete) {
    mysql.pool.query("SELECT race_id as id, track_name, DATE_FORMAT(race_date, '%m/%d/%Y') as race_date, race_weather, driver_name FROM race JOIN track ON race.track_id = track.track_id JOIN driver ON race.winner_id = driver.driver_id ORDER BY race_id ASC", function(error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.race = results;
      complete();
    });
  }

  function getRaceDrivers(res, mysql, context, complete) {
    mysql.pool.query("SELECT race_driver.race_id, race_driver.driver_id, driver_name, track_name FROM race_driver JOIN driver ON driver.driver_id = race_driver.driver_id JOIN race ON race_driver.race_id = race.race_id JOIN track ON race.track_id = track.track_id ORDER BY race_id ASC", function(error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.raceDriver = results;
      complete();
    });
  }

  function getRace(res, mysql, context, id, complete) {
    var sql = "SELECT race_id as id, track_id, DATE_FORMAT(race_date, '%Y-%m-%d') as race_date, race_weather, winner_id FROM race WHERE race_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.race = results[0];
      complete();
    });
  }

  function getDrivers(res, mysql, context, complete) {
    mysql.pool.query("SELECT driver_id as id, driver_name FROM driver", function(error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.driver = results;
      complete();
    });
  }

  function getTracks(res, mysql, context, complete) {
    mysql.pool.query("SELECT track_id as id, track_name, track_address, track_state, track_city, track_zip, track_length FROM track ORDER BY track_id ASC", function(error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.track = results;
      complete();
    });
  }

  function getTrack(res, mysql, context, id, complete) {
    var sql = "SELECT track_id as id, track_name, track_address, track_state, track_city, track_zip, track_length FROM track WHERE track_id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.track = results[0];
      complete();
    });
  }

  router.get('/', function(req, res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["delete.js"];
    context.active = { race: true };
    var mysql = req.app.get('mysql');
    getRaces(res, mysql, context, complete);
    getRaceDrivers(res, mysql, context, complete);
    getDrivers(res, mysql, context, complete);
    getTracks(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if ( callbackCount >= 4 ) {
        res.render('race', context);
      }
    }
  });

  // Display one race for the update race Button
  router.get('/ur:id', function(req,res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["selected.js", "updateRace.js"];
    var mysql = req.app.get('mysql');
    getRace(res, mysql, context, req.params.id, complete);
    getTracks(res, mysql, context, complete);
    getDrivers(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if ( callbackCount >= 3 ) {
        res.render('race_edit', context);
      }
    }
  });

  // Display one track for the update track page
  router.get('/ut:id', function(req,res) {
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateTrack.js"];
    var mysql = req.app.get('mysql');
    getTrack(res, mysql, context, req.params.id, complete);
    function complete() {
      callbackCount++;
      if ( callbackCount >= 1 ) {
        res.render('track_edit', context);
      }
    }
  });

  router.post('/', function(req, res){
    console.log(req.body.race)
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql;
    var inserts;
    if(req.body.insertRace != null){
      if(!req.body.track){
        return;
      } else if (!req.body.winner){
	      return;
      } else {
        sql = "INSERT INTO race (track_id, race_date, race_weather, winner_id) VALUES (?,?,?,?)";
        inserts = [req.body.track, req.body.date, req.body.weather, req.body.winner];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
          } else {
            res.redirect('/race');
          }
        });
      }
    }
    if(req.body.insertRaceDriver != null){
      if(!req.body.raceId){
	      return;
      } if (!req.body.driverId){
	      return;
      } else {
        sql = "INSERT INTO race_driver (race_id, driver_id) VALUES (?,?)";
        inserts = [req.body.raceId, req.body.driverId];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
          } else {
            res.redirect('/race');
          }
        });
      }
    }
    if(req.body.insertTrack != null){
      sql = "INSERT INTO track (track_name, track_address, track_state, track_city, track_zip, track_length) VALUES (?,?,?,?,?,?)";
      inserts = [req.body.name, req.body.address, req.body.state, req.body.city, req.body.zip, req.body.length];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
        } else {
          res.redirect('/race');
        }
      });
    }
/*
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
       if(error){
           console.log(JSON.stringify(error))
           res.write(JSON.stringify(error));
           res.end();
       }else{
           res.redirect('/race');
       }
    });
*/
  })

  router.put('/ur:id', function(req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.body);
    console.log(req.params.id);
    var sql = "UPDATE race SET track_id=?, race_date=?, race_weather=?, winner_id=? WHERE race_id=?";
    var inserts = [req.body.track, req.body.date, req.body.weather, req.body.winner, req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
      if (error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.status(200);
        res.end();
      }
    });
  });

  router.put('/ut:id', function(req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.body);
    console.log(req.params.id);
    var sql = "UPDATE track SET track_name=?, track_address=?, track_city=?, track_state=?, track_zip=?, track_length=? WHERE track_id=?";
    var inserts = [req.body.name, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.length, req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
      if (error) {
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.status(200);
        res.end();
      }
    });
  });

  router.delete('/dr:id', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql;
    var inserts;
    sql = "DELETE FROM race WHERE race_id = ?";
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

  router.delete('/race/:rid/driver/:did', function(req, res){
    //console.log(req) //I used this to figure out where did pid and cid go in the request
    console.log(req.params.rid)
    console.log(req.params.did)
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM race_driver WHERE race_id = ? AND driver_id = ?";
    var inserts = [req.params.rid, req.params.did];
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

  router.delete('/t:id', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql;
    var inserts;
    sql = "DELETE FROM track WHERE track_id = ?";
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

  return router;
}();
