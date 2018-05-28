/* webutils.js */
const fs = require('fs');
const path = require('path');
const extensions = {
	'html': 'text/html',
	'css': 'text/css',
	'txt': 'text/plain',
	'gif': 'image/gif',
	'png': 'image/png',
	'jpg': 'image/jpg',
	'jpeg': 'image/jpeg',
	'bmp': 'image/bmp',
	'webp': 'image/webp'
};

const webutils = {

	getExtension: function(fileName){
		const name = fileName.split(".");
		if(name[0].length === fileName.length){
			return "";
		}
		const extension = name[name.length - 1];
		return extension.toLowerCase();
	},

	sendTextFile: function(fileName, sock){
		fs.readFile(path.join( __dirname,'..','public',fileName), {'encoding':'utf-8'}, function(err, data) {
			if (err) {
				sock.write('HTTP/1.1 500 Internal Server Error\r\nContent-Type:' + extensions[webutils.getExtension(fileName)] +'The server encountered an unexpected condition that presented it from fulfilling the request\r\n\r\n');
			}
			else {
				sock.write('HTTP/1.1 200 OK\r\nContent-Type:'+ extensions[webutils.getExtension(fileName)] + '\r\n\r\n' + data);
			}
			sock.end();
		});
	},

	sendImage: function(fileName, sock){
		fs.readFile(path.join( __dirname,'..','public',fileName), {}, function(err, data) {
			if (err) {
				sock.write('HTTP/1.1 500 Internal Server Error\r\nContent-Type:' + extensions[webutils.getExtension(fileName)] +'The server encountered an unexpected condition that presented it from fulfilling the request\r\n\r\n');
			} 
			else {
				sock.write('HTTP/1.1 200 OK\r\nContent-Type:'+ extensions[webutils.getExtension(fileName)] + '\r\n\r\n');
				sock.write(data);
			}
			sock.end();
		});
	},

	redirect: function(fileName, relocation, sock){
		fs.readFile(path.join(__dirname, "..", "public", relocation), {'encoding':'utf-8'}, function(err, data) {

			if (err) {
				sock.write('HTTP/1.1 500 Internal Server Error\r\n' + "Content-Type:" + extensions[webutils.getExtension(relocation)] + '\r\n\r\n' + 'The server encountered an unexpected condition that presented it from fulfilling the request\r\n\r\n');
			}
			else {
				sock.write('HTTP/1.1 301 OK\r\nLocation:/' + relocation.split('.')[0] + '\r\n\r\n'); //slice out .html extension
				sock.write('HTTP/1.1 200 OK\r\nContent-Type:' + extensions[webutils.getExtension(relocation)] + '\r\n\r\n' + data);
			}
			sock.end();
		});
	},

};
module.exports = webutils;