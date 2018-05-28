// hoffy.js
//Denisa Vataksi

const rev = {

	/*Adds all of the arguments together and returns the 
	resulting sum. If there are no arguments, the resulting sum is 0.*/
	sum: function(...numbers){
		if(numbers.length === 0){
			return 0;
		}
		const res = numbers.reduce(function(previous, current) {
			return previous + current;
		},0);
		return res;
	},

	/*It calls function, fn, n times, passing in the argument, 
	arg to each invocation / call.*/
	repeatCall: function(fn, n, arg){
		if(n !== 0){
			fn(arg);
			return rev.repeatCall(fn, n - 1, arg);
		}
		return undefined; //ignores fn's return value
	},
	/*It calls function, fn, n times, passing in all of the remaining arguments 
	that were passed to the original function, as the arguments to the fn function invocation.*/	
	repeatCallAllArgs: function(fn, n, ...args){
		if(n !== 0){
			fn(...args);
			return rev.repeatCallAllArgs(fn, n - 1, ...args);
		}
		return undefined;

	},
	//checks if an object has a certain prop
	makePropertyChecker: function(prop){
		return function(object){
			return object.hasOwnProperty(prop);
		};
	},

	//decorates a function fn so it restricts the bounds of its return val
	constrainDecorator: function(fn, min, max){
		return function() {
			if(fn.apply(this, arguments) < min){
				return min;
			}
			else if(fn.apply(this, arguments) > max){
				return max;
			}
			else{
				return fn.apply(this, arguments);
			}
		};
	},
	//decorator keeps track and limits the amount of times a function, fn is called
	limitCallsDecorator: function(fn, n){
		let calls = 0;
		return function(){
			if (calls < n){
				calls++;
				return fn.apply(this, arguments);
			}
			else{
				return undefined;
			}
		};
	},


	//turns another function into a mapping function (to be used in Arrays)
	mapWith: function(fn) {
		return function(arr) {
			return arr.map(fn);
		};
	},


    //converts data from INI format to an object with keys and values
	simpleINIParse: function(s) {
		const obj = {};
		const arr = s.split("\n");
		arr.map(function(value) {
			if (value.split("=") !== value && !value.includes(";")) {
				const arr2 = value.split("=");
				if (arr2[0] !== undefined && arr2[1] !== undefined) {
					obj[arr2[0]] = arr2[1];
				}
		}
	});
		return obj;
	},
	/*take a parsing function and turn it into a function 
	that opens a file and immediately parses it.*/
	readFileWith: function(fn) {
		const fs = require('fs');
		return function(filename, callback) {
			fs.readFile(filename, 'utf8', function(err, data) {
				if (!err) {
					callback(err, fn(data));
				} else {
					callback(err, undefined);
				}
			});
		};
	}

};
module.exports = rev;









