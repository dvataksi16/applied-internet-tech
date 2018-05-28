const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(username, email, password, errorCallback, successCallback) {
	User.findOne({username}, function(err, user){
		if(user){
			console.log("duplicate username in db");
			errorCallback({message: "USERNAME ALREADY EXISTS"});
		}
		else if(username.length >= 8 && password.length >= 8){
				bcrypt.hash(password, 10, function(err, hash) {
					new User({
						username:username,
						email:email,
						password:hash
					}).save(function(err, user){
						if(err){
							console.log("error saving entry into db");
							errorCallback({message: "DOCUMENT SAVE ERROR"});
						}
						else{
							console.log("REGISTRATION SUCCESSFUL");
							successCallback(user);
						}
					});
				});
			}
			else{
				console.log("username/password too short error");
				errorCallback({message: "USERNAME PASSWORD TOO SHORT"});
			}
	});
}

function login(username, password, errorCallback, successCallback) {
	User.findOne({username: username}, function(err, user){
		if (!err && user) {
         // compare with form password!
			bcrypt.compare(password, user.password, (err, passwordMatch) => {
			// regenerate session if passwordMatch is true
				if(passwordMatch){
					console.log("LOGIN SUCCESSFUL");
					successCallback(user);
				}
				else{
					console.log("password detected as incorrect");
					errorCallback({message: "PASSWORDS DO NOT MATCH"});
				}
			});
		}
		else{
			console.log("user not in db");
			errorCallback({message: "USER NOT FOUND"});
		}
     });
}

function startAuthenticatedSession(req, user, cb) {
	// assuming that user is the user retrieved from the database
	req.session.regenerate((err) => {
		if (!err) {
			console.log("authenticated session started");
			//console.log(req);
			req.session.user = user;
			cb(err);
		}
		else{
			console.log("cant authenticate error");
		}
		
	});
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
