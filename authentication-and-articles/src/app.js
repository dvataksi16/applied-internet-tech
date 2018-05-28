const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

const User = mongoose.model('User');
const Article = mongoose.model('Article');

app.use((req,res, next)=>{
	console.log("Body:", req.body);
	console.log("Method:", req.method);
	console.log("Path:",req.path);
	console.log("Query:",req.query, "\n");
	next();
});
// add req.session.user to every context object for templates
app.use((req, res, next) => {
// now you can use {{user}} in your template!
	res.locals.user = req.session.user;
	console.log(req.session.user);
	next();
});

app.get('/', (req, res) => {
	if(req.session.user){
		console.log('session username: '+ req.session.user.username);
		Article.find((err, articles) => {
			if(articles.length){
				res.render('index', {user: req.session.user, articles: articles});
			}
			else{
				res.render('index', {user: req.session.user});
			}
		});
	}
	else{
		res.render('index');
	}
});

app.get('/article/add', (req, res) => {
	if(req.session.user){
		res.render('article-add');
	}
	else{
		res.redirect('/');
	}
});

app.post('/article/add', (req, res) => {
	new Article({
		title: req.body.title,
		url: req.body.url,
		description: req.body.description,
		userid: req.session.user.username
	}).save(function(err) {
		if(err){
			console.log("error saving article in post");
			res.render('article-add');
		}
		else{
			res.redirect('/');
		}
	});
});
// come up with a url for /article/slug-name!
app.get('/article/:slug', (req, res) => {
	Article.findOne({slug: req.params.slug}, (err, article) => {
		res.render('article-detail', {article: article});
	});
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	auth.register(req.body.username, req.body.email, req.body.password, (err) => {
		res.render('register', {message: err.message});
	},
	(user) => {auth.startAuthenticatedSession(req, user, (err) => {
			if (!err) {
				console.log("user registered -- redirecting");
				res.redirect('/');
			}
		});
	});
});
app.get('/login', (req, res) => {
	res.render('login');
});
app.post('/login', (req, res) => {
	auth.login(req.body.username, req.body.password, (err) => {
		res.render('login', {message: err.message});
	},
	(user) => {auth.startAuthenticatedSession(req, user, (err) => {
			if (!err) {
				console.log("user recognized-- redirecting");
				res.redirect('/');
			}
		});
	});
});


//extra credit
app.get('/article/user/:username', (req, res) => {
	User.findOne({username: req.params.username}, (err, user) => {
		if (user) {
			Article.find({userid: user.username}, (err, articles) => {
				if(err){
					console.log("error finding user articles");
				}
				console.log(user.username);
				console.log(articles);
				res.render('article-user', {username: user.username, articles: articles});
			});
		}
		else{
			console.log("error finding username for view users articles page");
		}
	});
});

app.listen(3000);
console.log('Server started');