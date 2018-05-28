/* intro.js */
const webutils = require('./webutils.js');

const net = require('net');
const HOST = "127.0.0.1";
const PORT = 9090;
/**
 * Request object - takes http request string and parses out path
 * @param s - http request as string
 */
class Request {
	constructor(s) {
        this.method = s.split(' ')[0];
		this.path = s.split(' ')[1];
        this.body = s.split('\r\n\r\n')[1];
	}
}

// create a server
const server = net.createServer((sock) => {
	console.log(sock.remoteAddress, sock.remotePort);
	sock.on('data', (binaryData) => {
		const req = new Request(binaryData.toString()); 
        if(req.method === 'POST'){
            if(req.path === '/form'){
                sock.write('HTTP/1.1 200 OK\r\n\r\n' + req.body);
                sock.end();
            }
        }
        else if(req.method === 'GET'){
            if(req.path === '/'){
                webutils.sendTextFile("html/intro.html",sock);
            }
            else if(req.path ==='/such/stylish'){
                webutils.sendTextFile('html/such/stylish.html', sock);
            }
            else if(req.path ==='/css/base.css'){
                webutils.sendTextFile('css/base.css',sock);
            }
            else if(req.path === '/picsplz'){
                webutils.sendTextFile('html/picsplz.html',sock);
            }
            else if(req.path === '/images/sloth.jpg'){
                webutils.sendImage('images/sloth.jpg', sock);
            }
            else if(req.path === '/showanimage'){
                console.log("pls print");
                webutils.redirect("html/showanimage.html",'html/picsplz.html',sock);
            }
            else{
                sock.write("HTTP/1.1 404 Not Found\r\nContent-Type:text/plain\r\n\r\nPage Not Found!");
                sock.end();
            }
        }
        else{
            sock.write("HTTP/1.1 405 Method Not Allowed\r\nContent-Type:text/plain\r\n\r\nThe method received in the request-line is known by the origin server but not supported by the target resourse.");
            sock.end();
        }
    });
});

server.listen(PORT, HOST);
console.log("Server started, type ctrl + c to stop");
