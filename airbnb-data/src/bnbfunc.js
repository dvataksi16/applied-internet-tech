// bnbfunc.js
//Denisa Vataksi


const rev = {
	processAirBnbData: function(listings){
      //filter out undefined objects
      listings = listings.filter(function(listing){
      	return listing.name !== undefined;
      });

		let report = "";
		//AVERAGE RATING (overall satisfaction)
		const sumOfRatings = listings.reduce(function(prev,currentSum) { //REDUCE
			if(currentSum.overall_satisfaction !== undefined){
				return prev + parseFloat(currentSum.overall_satisfaction);
			}
			else{
				return prev;
			}
		},0);
		const averageRating = sumOfRatings / listings.length;
		report += "* Average rating of the current dataset is: " + averageRating.toFixed(2) + "\n";

		//AVERAGE PRICE
		let sumOfPrices = 0;
		listings.forEach(function(prices) { //FOREACH
			sumOfPrices += parseFloat(prices.price);

		});
		const averagePrice = sumOfPrices/listings.length;
		report += "* Average price of the current dataset is: " + averagePrice.toFixed(2) + "\n";
		
		/*All listings in the current dataset with a "rating greater than 4.8, priced less than 55, 
		and accommodating more than 6 people" (because you like to party!)*/
		const highRatingListings = listings.filter(function(listing) { //FILTER
				return parseFloat(listing.overall_satisfaction) >= 4.8 && parseFloat(listing.price) < 55
					&& parseFloat(listing.accommodates) > 6;
		},0);
		report += "* All listings in the current dataset with a rating greater than 4.8, priced less than 55, and accommodating more than 6 people:";
		highRatingListings.forEach(function(highRatingListing) {
			return report += "	* Listing ID: "+ highRatingListing.room_id + " with a rating of "
				+ highRatingListing.overall_satisfaction + " priced at "+ highRatingListing.price + " in "+ highRatingListing.city 
				+" accommodates "
				+ highRatingListing.accommodates + "\n";
		});
		//The two highest reviewed listings
		function compare(a,b) {
			if (parseInt(a.reviews) < parseInt(b.reviews))
				{return 1;}
			if (parseInt(a.reviews) > parseInt(b.reviews))
				{return -1;}
			return 0;
		}
		const sorted = listings;
		sorted.sort(compare);
		const max = sorted[0];
		const max2 = sorted[1];

		report+= "* The two highest reviewed listings of the current dataset are:\n";

		report += "     * ID: "+ max.room_id + " in San Francisco reviewed " + max.reviews + 
				" times and rated  "+ max.overall_satisfaction + "\n";
		report += "     * ID: "+ max2.room_id + " in San Francisco reviewed " + max2.reviews + 
				" times and rated  "+ max2.overall_satisfaction + "\n";
	

		//The borough with the most expensive listings on average in NYC
		/*DISCLAIMER: this portion takes a while to run*/
		const nyc = listings.filter(function(listing){ //ensure that the listings are solely from nyc
			return listing.city === "New York";
		});
		if(nyc.length > 0){
			//get name of boroughs (keep same format as the format on AirBnb)
			const boroughs = nyc.map(function(listing){ //MAP
				return listing.borough;
			});

			const avgPerBorough = {}; //holds max price per borough
			let maxPrice = -1; 
			let maxBorough = "";

			boroughs.forEach(function(borough){
				const boroughListings = nyc.filter(function(listing){
					return listing.borough === borough;
				});

				const boroughPrices = boroughListings.reduce(function(prev, boroughListing){
					if(boroughListing.price !== undefined){
						return prev + parseFloat(boroughListing.price);
					}
					else{
						return prev;
					}
				},0);

				//get avg prices per borough
				avgPerBorough.borough = borough;
				avgPerBorough.maxPrice = boroughPrices/boroughListings.length;
				//console.log(avgPerBorough.maxPrice);
				if(avgPerBorough.maxPrice > maxPrice){
					maxPrice = avgPerBorough.maxPrice;
					maxBorough = borough;
				}
			});

			report += "* For the current dataset, "+ maxBorough + " has the most expensive listings in NYC with an average listing price of "
			+ maxPrice + "\n";
		}
		else{
			report += "* This file has no data about NYC!";
		}	

		return report;
	}	
};
module.exports = rev;
