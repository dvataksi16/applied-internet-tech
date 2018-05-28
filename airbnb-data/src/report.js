//report.js

//Denisa Vataksi

const rev = require('./bnbfunc.js');
const request = require('request');

const url = "http://jvers.com/csci-ua.0480-spring2018-008/homework/02/airbnb/1a9c766e75e3ff17009936fc570fb8e1.json";

function parse(data){
	const listings = data.trim().split("\n");
	for(let i = 0; i < listings.length; i ++){
		listings[i] = JSON.parse(listings[i]);
	}
	return listings;	
}

function retrieve(url) {
	request(url, function(err, response, data) {
		if (!err && response.statusCode === 200 && data) { 
			console.log("===================================");
			console.log("url:  " + url);
			console.log("===================================\n");
			//Parse JSON data
			const listings = parse(data);
			let file;
			console.log(rev.processAirBnbData(listings));
			//check if we are getting more json files to read in by looking at last json object in array
			if (listings[listings.length - 1].hasOwnProperty("nextFile")) { //there exists a next file!
				file = listings[listings.length - 1].nextFile;
				const newURL = 'http://jvers.com/csci-ua.0480-spring2018-008/homework/02/airbnb/' + file;
				retrieve(newURL);
			}
		}
		else {
				console.log("Error: ", err);
		}
	});
}
retrieve(url);




// /*Part 2 - Processing AirBnb listings data, Reading from a local JSON file*/
// const fs = require('fs');
// fs.readFile("/Users/denisavataksi/Desktop/combined-airbnb-data.json","utf8", function(err,data){
// 	if(!err){
// 		const listings = data.trim().split("\n");
// 		// console.log(listings[0]);
// 		// console.log("\n");
// 		for(let i = 0; i < listings.length; i ++){
// 			listings[i] = JSON.parse(listings[i]);
// 		}
// 		//console.log(listings[0]); //tests the raw data vs parsed data
// 		//console.log("Listing no. 17453 is a listing of type: \"", listings[17453].room_type, "\" located in ", listings[17453].neighborhood, listings[17453].city, " with a rating of ", listings[17453].overall_satisfaction, " and has been reviewed ", listings[17453].reviews, " times.");
// 		console.log(rev.processAirBnbData(listings));
// 	}
// 	else{
// 		console.log("Error: ", err);
// 	}
// });