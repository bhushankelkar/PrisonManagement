var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var admin_id;
var path = require('path');
var router=express.Router();
global.admin_id;
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
connection.query('SELECT * FROM prisoners WHERE prisoner_id=?', req.query['category'] , function(error, results, fields) {
	res.render('prisoner.html',{prisoner:results});

});
});
app.get('/appoint', function(req, res) {
  
connection.query('SELECT * FROM visitors WHERE visitor_id in (select visitor_id from has where prisoner_id=?)', req.query['category'] , function(error, results, fields) {
	console.log(results);
	res.render('visitors.html',{visitors:results,id:req.query['category']});

});
});
app.get('/rouVis', function(req, res) {
  
res.render('addVisitor.html',{id:req.query['category']});
});
app.get('/rouCriminal', function(req, res) {
  sid=req.query['category'];
res.render('addCriminal.html',{sid:sid});
});
app.post('/addVis',function(request,response){
fname=request.body.fname;
lname=request.body.lname;
vid=request.body.vid;
pid=request.body.id;
var res=[];
	if (fname && lname && vid) {                                                                                                                            
		connection.query('insert into visitors values (?,?,?)', [vid,fname,lname] , function(error, results, fields) {
			 if(error)console.log("error");
			


			connection.query('insert into has values(?,?)',[vid,pid],function(error,result,fields){
				if(error)console.log("error");
				connection.query('SELECT * FROM visitors WHERE visitor_id in (select visitor_id from has where prisoner_id=?)', pid , function(error, results, fields) {
			
						 
			
});

			});
	// 		connection.query('SELECT * FROM visitors ', function(error, results, fields) {
	// console.log(results);

	

});
}
});
			// console.log(results.username);
app.post('/addCriminal',function(request,response){
fname=request.body.fname;
lname=request.body.lname;
pid=request.body.pid;
address=request.body.address;
datei=request.body.doi;
datej=request.body.dou;
age=request.body.age;
sid=request.body.section_id;
cid=request.body.cid;
var res=[];
	if (fname && lname && sid) {                                                                                                                            
		connection.query('insert into prisoners values (?,?,?,?,?,?,?,?)', [pid,fname,lname,address,datei,datej,age,sid] , function(error, results, fields) {
			 if(error)console.log("error");
			


			connection.query('insert into commited values(?,?)',[cid,pid],function(error,result,fields){
					  if(error)console.log("error");
			
});

			
	// 		connection.query('SELECT * FROM visitors ', function(error, results, fields) {
	// console.log(results);

	


console.log("here");

response.redirect('back');	

			response.end();
		
	});
	}else {
		response.send('Please enter Username and Password!');
		response.end();
	}



});



app.post('/auth', function(request, response) {
	username = request.body.username;
	 password = request.body.password;
	
	if (username && password) {
		connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password] , function(error, results, fields) {
			 if (results.length > 0) {

			 	console.log(results);
			 	request.session.loggedin = true;
			 	request.session.username = results.username;
			 	request.session.password=results.password;
			 	id=results[0].admin_id;
			 	
			 	console.log(username);
			 	console.log(password);
			 	console.log(id);
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
var prisoners=[];
var priso=[];

// response.sendFile(path.join(__dirname + '/home.html'));
	 if (request.session.loggedin) 
		{
		console.log(id);
		connection.query('SELECT * FROM prisoners p where p.section_id  = (select  s.section_id from section s ,login l where s.admin_id=l.admin_id and l.admin_id=?)',[id],
			function(error, results, fields) {
			 console.log(results);
			for(var i=0;i<=results.length-1;i++)
			 	{prisoners.push(results[i]);
			 		//priso.push(results[i].prisoner_id);
			 	}
		console.log(prisoners);
		 for(var i=0;i<=1;i++)
		 		console.log(prisoners[i]);	
	  response.render('home.html',{username:username,prisoners:prisoners,sid:prisoners[0].section_id});
		 
	});
		
	} else {
	response.send('Please login to view this page!');
	
}
});
app.use('/', router);

app.listen(8800);