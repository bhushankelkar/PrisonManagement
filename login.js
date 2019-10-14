var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var path = require('path');
var router=express.Router();

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'prison'
});

var app = express();
app.set('html');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

var username;
var password;
app.post('/auth', function(request, response) {
	username = request.body.username;
	 password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password] , function(error, results, fields) {
			 if (results.length > 0) {
			 	request.session.loggedin = true;
			 	request.session.username = results.username;
				response.redirect('/home');
			 } else {
			 	response.send('Incorrect Username and/or Password!');
			 }		
			// console.log(results.username);

			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

router.get('/home', function(request, response) {

// response.sendFile(path.join(__dirname + '/home.html'));
	 if (request.session.loggedin) 
		{
		console.log(username);
	 response.render('home.html',{username:username});
	}// } else {
		//response.send('Please login to view this page!');
	
});
app.use('/', router);

app.listen(8800);