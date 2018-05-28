/* better.js */
//utilizing tiny web framework

const App = require('./webframework.js').App;
const app = new App();

const HOST = '127.0.0.1';
const PORT = 9090;



app.get('/', function(req,res){
	res.sendFile("/html/index.html");
});

app.get('/css/base.css', function(req, res){
  res.sendFile("/css/base.css");
});
app.get('/form', function(req, res) {
	res.sendFile("/html/form.html");

});
app.post('/form', function(req, res) {
	res.send(200, req.body);
	res.end();

});

app.get('/random', function(req,res){
  res.sendFile("/html/random.html");
});
//redirection
app.get('/rando', function(req, res){
  res.redirect(301, '/random');
  res.end();
});

app.get('/randopic', function(req,res){
	const availableImages ={
		0: "images/image1.jpg",
		1: "images/image2.gif",
		2: "images/image3"
	};
	const randoIndex = Math.floor(Math.random()* 3);
	const file = availableImages[randoIndex];
	if(randoIndex === 2){
		res.sendFile(file + ".jpeg");
	}else{
		res.sendFile(file);
	}
});

//images
app.get('/images/image1.jpg', function(req,res){
  res.sendFile('/images/image1.jpg');
});

app.get('/images/image2.gif', function(req,res){
  res.sendFile('/images/image1.gif');
});

app.get('/images/image3', function(req,res){
	res.sendFile('/images/image3');
});

app.listen(PORT,HOST);


