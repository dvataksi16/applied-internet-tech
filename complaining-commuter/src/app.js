//@author Denisa Vataksi


const express = require('express');
const app = express();
app.set('view engine', 'hbs');

const session = require('express-session');
const sessionOptions = {
    secret: 'secret!',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));


//recent version of express includes bodyParser

//const bodyParser = require('body-parser');

// const HOST = '127.0.0.1';
// const PORT = 3000;


//static
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');


app.use(express.urlencoded({extended: false}));

app.use(express.static(publicPath));

const data = [
{complaint: "The person sitting next to me was eating hard-boiled eggs in the subway car (???!!!)", subwayLine: "G"},
{complaint: "There was a possum loose on the platform", subwayLine: "F"},
{complaint: "The train was an hour late!", subwayLine: "A"}
];
//let complaints = {};

app.use((req,res, next)=>{
	console.log("Method:", req.method);
	console.log("Body:", req.body);
	console.log("Path:",req.path);
	console.log("Query:",req.query, "\n");
	next();
});


app.get('/', (req,res) => {
	const displayData = [...data].reverse();
	if(req.query.subwayLine){
		const line = req.query.subwayLine || "";
		res.render('index', {title: "Complaints List", content: displayData.filter(
			d => d.subwayLine === line)
		});
	}
	else{
		res.render('index', {title: "Complaints List", content: displayData});
	}
});
app.get('/complain', (req,res) => {
	res.render('complain', {title: "Add a Complaint!"});
});
app.post('/complain', (req, res) => {
	const newComplaint = {complaint: req.body.complaint,
		subwayLine: req.body.subwayLine};
	data.push(newComplaint);
	if(req.session.count){
		req.session.count++;
	}
	else{
		req.session.count = 1;
	}

	res.redirect('/');
});

app.get('/stats', (req,res) => {
	const count = req.session.count || 0;
	res.render('stats', {title: "Stats", complainCount: count});
});

app.listen(3000);
console.log('Server started');