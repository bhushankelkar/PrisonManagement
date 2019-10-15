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
app.get('/here', function(req, res) {
  console.log('Category: ' + req.query['category']);
  res.send(req.query['category']);
 
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

app.get('/login',function(request,response){
	response.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/about',function(request,response){
	response.sendFile(path.join(__dirname + '/about.html'));
});

router.get('/home', function(request, response) {
var prisoners=[];
var prisname=[];
var priso=[];

// response.sendFile(path.join(__dirname + '/home.html'));
	 if (request.session.loggedin) 
		{
		//console.log(username);
		connection.query('SELECT * FROM prisoners', function(error, results, fields) {
			//console.log(results);
			for(var i=0;i<=results.length-1;i++)
				{
					prisoners.push(results[i].prisoner_id);
					//priso.push(results[i].prisoner_id);
				}
		//console.log(prisoners);
		for(var i=0;i<=results.length;i++)
				console.log(prisoners[i]);	
	 response.render('home.html',{username:username,prisoners:prisoners});
		});
		
	}// } else {
		//response.send('Please login to view this page!');
	
});
app.use('/', router);

app.listen(8800);