// app.js
require( './db.js' );
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const Review = mongoose.model('Review');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res, next)=>{
	console.log("Body:", req.body);
	console.log("Method:", req.method);
	console.log("Path:",req.path);
	console.log("Query:",req.query, "\n");
	next();
});

const sessionOptions = {
    secret: 'secret!',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));


app.use(function(req, res, next){
	if(!req.session.count){
		req.session.count = 1;
	}
	res.locals.count = req.session.count;
	next();
});



app.get('/', function(req, res) {
	req.session.count++;
	const semester = req.query.semester || "";
	const year = req.query.year || "";
	const professor = req.query.professor || "";
	const query = {};
	if(semester && semester !== "all") {query.semester = semester;}
	if(year) {query.year = year;}
	if(professor) {query.professor = professor;}

	Review.find(query, function(err, reviews){
		if(err){
			res.send(err);
		}
		else{
			console.log(reviews);
			res.render('index', {reviews: reviews});
		}
	});
});

app.get('/reviews/add', function(req,res) {
	req.session.count++;
	res.render('add');
});

app.post('/reviews/add', function(req, res) {
	new Review({
		courseNumber: req.body.courseNumber,
		courseName: req.body.courseName,
		semester: req.body.semester,
		year: req.body.year,
		professor: req.body.professor,
		review: req.body.review,
		session: req.session.id
	}).save(function(err) {
		if(err){
			res.send(err);
		}
		else{
			res.redirect('/');
		}
	});
});

app.get('/reviews/mine',function(req,res) {
	req.session.count++;
	Review.find({session: req.session.id}, function(err, reviews){
		if(err){
			res.send(err);
			res.render('mine');
		}
		else{
			res.render('mine',{reviews: reviews});
		}
	});	
});


app.listen(3000);
console.log("Server started");
