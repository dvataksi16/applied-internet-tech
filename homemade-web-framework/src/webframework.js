/* webframework.js */
const fs = require('fs');
const net = require('net');
const statusCodes = {
			"200" : "OK",
			"301" : "Moved Permanently",
			"302" : "Found",
			"303" : "See Other",
			"400" : "Bad Request",
			"404" : "Not Found",
			"500" : "Internal Server Error"
};
const extensions = {
			'html': 'text/html',
			'css': 'text/css',
			'txt': 'text/plain',
			'gif': 'image/gif',
			'png': 'image/png',
			'jpeg': 'image/jpeg',
			'jpg': 'image/jpg',
			'bmp': 'image/bmp',
			'webp': 'image/webp'
};

class Request {
	constructor(httpRequest){
		const arr = httpRequest.split('\r\n');
		const requestLine = arr[0];
		this.body = arr[arr.length-1];

		this.method = requestLine.split(' ')[0];
		this.path = requestLine.split(' ')[1];
		this.headers = {};

		//headers
		for(let i = 1; i < arr.length - 1; i++){
			if(arr[i]){
				const headersLine = arr[i].split(': ');
				const key = headersLine[0];
				const value = headersLine[1];
				this.headers[key] = value;
			}
		}
	}

	toString() {
		let string = "";
		string += this.method + " " + this.path + " HTTP/1.1\r\n";
		for(const header in this.headers){
			string += header + ": " + this.headers[header] + "\r\n";
		}
		string += "\r\n";
		string += this.body;
		return string;
	}
}

class Response {
	constructor(socket){
		this.sock = socket;
		this.headers = {};
		this.body = "";
		this.statusCode = 404;
	}	
	setHeader(name, value){
		this.headers[name] = value;
	}

	write(data){
		console.log("before write");
		this.sock.write(data);
		console.log("after write");
	}
	end(s){
		this.sock.end(s);
	}
	send(statusCode, body){
		console.log("before send");
		this.statusCode = statusCode;
		this.body = body;
		const status = this.toString();
		console.log("after send");
		this.end(status);

	}
	writeHead(statusCode){
		console.log("before writeHead");
		this.statusCode = statusCode;

		let head = "HTTP/1.1 " + this.statusCode + " " + statusCodes[this.statusCode] + "\r\n";
		for(const header in this.headers){
			head += header + ": " + this.headers[header] + "\r\n";
		}
		head += "\r\n";
		this.write(head);
		console.log("after writeHead");
	}
	redirect(statusCode, url){
		console.log("before redirect");
		if(arguments.length < 2){
			this.statusCode = 301;
			this.headers["Location"] = statusCode; //statusCode param is absent and url is args[0] ( = statusCode)
		}
		else{
			this.statusCode = statusCode;
			this.headers["Location"] = url;
		}
		this.send(this.statusCode, this.body);
		console.log("after redirect");
		return statusCode;
	}

	toString(){
		let string = "HTTP/1.1 " + this.statusCode + " " + statusCodes[this.statusCode] + "\r\n";
		for(const header in this.headers){
			string += header + ": " + this.headers[header] + "\r\n";
		}
		string += "\r\n";
		string += this.body;
		return string;
	}
	sendFile(fileName){
		const projectRoot = __dirname + '/../public/';
		const filePath = projectRoot + fileName;
		const fileExtension = fileName.split(".")[1];
			
		const contentType = extensions[fileExtension];
		console.log("before sendFile");
		//send text => utf8
		if(fileExtension === 'txt' || fileExtension === 'html' 
			|| fileExtension === 'css'){
			console.log("before readFile");
			fs.readFile(filePath, {'encoding':'utf-8'}, this.handleRead.bind(this, contentType));
			console.log("after readFile");
		}
		//send image
		else{
			fs.readFile(filePath, {}, this.handleRead.bind(this, contentType));
		}
		console.log("after sendFile");
	}

	handleRead(contentType, err, data){
		console.log("before handleRead");
		if(err){
			this.writeHead(500);
			console.log("after handleRead before end");
			this.end();

		}
		else{
			this.setHeader("Content-Type", contentType);
			this.writeHead(200);
			this.write(data);
			console.log("after handleRead before end");
			this.end();
		}
		console.log("after handleRead after end");
	}

}

class App {
	constructor(){
		console.log("before handleConnection");
		this.server = net.createServer(this.handleConnection.bind(this));
		/*
		* key-> method + path (concatenated)
		* method path delimeter ==> '/'
		* value-> callback function
		*/
		this.routes = {};
		console.log("after handleConnection");
	}

	get(path,cb){
		this.routes["GET/"+ path] = cb;
	}
	post(path, cb){
		this.routes["POST/" + path] = cb; 
	}
	listen(port, host){
		this.server.listen(port,host);
	}
	handleConnection(sock){
		sock.on("data", this.handleRequestData.bind(this, sock));
	}
	//framework does not have timeouts.. assumes data received is entire request
	handleRequestData(sock, binaryData){ 
		const data = binaryData.toString();
		const req = new Request(data);
		const res = new Response(sock);

		//valid request
		if(!req.headers.hasOwnProperty("Host")){
			res.send(400, "Bad Request");
		}
		else if(this.routes.hasOwnProperty(req.method + '/' + req.path)){
			//lookup callback function to call from routes
			const cb = this.routes[req.method + '/' + req.path];
			cb(req, res);
		}
		//err
		else{
			res.send(404, "Page not found");
		}
		sock.on('close', this.logResponse.bind(this,req,res));
	}
	logResponse(req, res){
		console.log(req.method + " " + req.path + " - " + res.statusCode + " " + statusCodes[res.statusCode]);
	}
}

module.exports = {
	Request: Request,
	Response: Response,
	App: App
};
