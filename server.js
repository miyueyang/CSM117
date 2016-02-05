// sql reference: https://github.com/felixge/node-mysql#getting-the-id-of-an-inserted-row
var mysql      = require('mysql');
var express    = require("express");
var http 	   = require('http');
var url 	   = require('url');
var util	   = require('util');

var app = express();

// the following information need to be stored in the target db
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'testuser',
	password : 'password',
	database : 'BT'
});

connection.connect();
connection.query('SHOW TABLES', function(err, rows, fields) {
	if (!err)
    	console.log('Tables in database: ', rows);
   	else
    	console.log('Error while performing Query.');
});

var server = app.listen(8081, function () {
	var host = server.address().address
 	var port = server.address().port
  	console.log("Example app listening at http://%s:%s", host, port)
})

// list all users
app.get('/listuser', function (req, res) {
	connection.query('SELECT * from USER', function(err, rows, fields) {
	if (!err){
		res.end(JSON.stringify(rows));
	}
	else
    	console.error(err);
	});
});

// insert a new user, result contains user id
app.get('/newuser/:name/:lon/:lat', function (req, res) {
	var newuser = {
		name: req.params.name,
		lon: req.params.lon,
		lat: req.params.lat
	};

	var query = connection.query('insert into user set ?', newuser, function(err, result) {
		if (!err){
			console.log(query.sql);
			res.end(JSON.stringify(result));
		}
		else
	    	console.error(err);
	    	res.end(JSON.stringify(err));
	});
});

// update a user's info
app.get('/updateuser/:id/:lon/:lat', function (req, res) {
	var queryString = util.format('update user set lon = %s, lat = %s where id = %s', req.params.lon, req.params.lat, req.params.id);
	var query = connection.query(queryString, function(err, result){
		if (!err){
			console.log(query.sql);
			res.end(JSON.stringify(result));
		}
		else
	    	console.error(err);
	    	res.end(JSON.stringify(err));
	});
});



