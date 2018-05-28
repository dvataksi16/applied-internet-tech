const DEFAULT_AIT_PORT = 3000;

// database setup
require('./db');
const mongoose = require('mongoose');

// express
const express = require('express');
const app = express();

// static files
const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// body parser
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');


app.use((req,res, next)=>{
	console.log("Body:", req.body);
	console.log("Method:", req.method);
	console.log("Path:",req.path);
	console.log("Query:",req.query, "\n");
	next();
});

const Review = mongoose.model('Review');

app.get('/api/review', function(req, res) {
  // TODO: retrieve all reviews or use filters coming in from req.query
  // send back as JSON list
	const q = {};
  const semester = req.query.semester || "";
	const year = req.query.year || "";
	if(semester && semester !== "all") {q.semester = semester;}
	if(year) {q.year = year;}
  Review.find(q).exec((err, result) => {
		res.json(result) ;
  });

});

app.post('/api/reviews/create', (req, res) => {
  // TODO: create new review... if save succeeds, send back JSON
  // representation of saved object
	console.log('hello inside post');
	const review = new Review({
        name: req.body.name,
        semester: req.body.semester,
				year: req.body.year,
				review: req.body.review
    });
    review.save((err, result) => {
        // send back object that was saved
        res.json(result);
    });

});

app.listen(process.env.PORT || DEFAULT_AIT_PORT, (err) => {
	if(err){
		console.log(err);
	}
	else{
		console.log('Server started (ctrl + c to shut down)');
	}
});
