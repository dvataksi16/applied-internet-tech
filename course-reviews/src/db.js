const mongoose = require('mongoose');


//schema goes here
const Review = new mongoose.Schema({
	courseNumber: String,
	courseName: String,
	semester: String,
	year: Number,
	professor: String,
	review: String,
	session: String
});

mongoose.model('Review', Review);

mongoose.connect('mongodb://localhost/hw05');
