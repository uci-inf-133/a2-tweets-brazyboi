function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const activityFreq = new Map();
	const activityDist = new Map();
	// const dayToTweet = new Map();
	tweet_array.forEach(element => {
		if (element.activity !== "unknown") {
			activityFreq.set(element.activityType, (activityFreq.get(element.activityType) || 0) + 1);	
			activityDist.set(element.activityType, (activityDist.get(element.activityType) || 0) + element.distance);
			// dayToTweet.set(element.time.getDay(), [...(dayToTweet.get(element.time.getDay()) || []), element]);
		}
	});

	// console.log(dayToTweet);
	updateActivitySpans(tweet_array, activityFreq, activityDist);	

	const formattedFreq = Array.from(activityFreq, ([activity, freq]) => ({
		activityType: activity, 
		frequency: freq
	}));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": formattedFreq
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": {
			"field": "activityType", 
			"type": "nominal",
			"axis": {"title": "Activity Type"}
		},
		"y": {
			"field": "frequency",
			"type": "quantitative",
			"axis": {"title": "Count"}
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const topThree = Array.from(activityFreq.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
		.map(d => d[0]);
	
	const formattedDay = tweet_array
		.filter(element => topThree.includes(element.activityType))
		.map(element => ({
			day: dayNames[element.time.getDay()], 
			distance: element.distance,
			activity: element.activityType
		}));

	distance_vis = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": formattedDay
	  },
	  //TODO: Add mark and encoding
	  "mark": "point",
	  "encoding": {
		"x": {
			"field": "day",
			"type": "nominal",
			"sort": dayNames,
			"axis": {"title": "day of the week"}
		},
		"y": {
			"field": "distance",
			"type": "quantitative",
			"axis": {"title": "distance (mi)"}
		},
		"color": {
			"field": "activity",
			"type": "nominal",
		}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis, {actions:false});

	const distance_aggregate_vis = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": formattedDay
	  },
	  //TODO: Add mark and encoding
	  "mark": "point",
	  "encoding": {
		"x": {
			"field": "day", 
			"type": "nominal",
			"sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			"axis": {"title": "day of the week"}
		},
		"y": {
			"aggregate": "mean",
			"field": "distance",
			"type": "quantitative",
			"axis": {"title": "avg distance (mi)"}
		},
		"color": {
			"field": "activity",
			"type": "nominal",
		}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_aggregate_vis, {actions:false});
	document.getElementById('distanceVisAggregated').style = 'visibility: hidden;';

	// BUTTON FUNCTIONS
	// const 
	// document.
	const button = document.getElementById('aggregate');
	let buttonState = 'all';
	button.onclick = () => {
		const vis = document.getElementById('distanceVis');
		const visAgg = document.getElementById('distanceVisAggregated');
		if (buttonState == 'all') {
			buttonState = 'mean';
			button.innerText = 'Show all activities';

			vis.style = 'display: none;';
			visAgg.style = 'display: block;';
		} else {
			buttonState = 'all';
			button.innerText = 'Show means'

			vis.style = 'display: block;';
			visAgg.style = 'display: none;';
		}
	}
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateActivitySpans(tweet_array, activityFreq, activityDist) {
	const sortedFreq = [...activityFreq.entries()].sort((a, b) => b[1] - a[1]);
	const firstType = sortedFreq[0][0];
	const secondType = sortedFreq[1][0];
	const thirdType = sortedFreq[2][0];

	applyFreqSpans(activityFreq.size, firstType, secondType, thirdType);


	const activityMeans = calculateMeans(activityDist, activityFreq);
	// in desc order
	const topThreeMeans = [[firstType, activityMeans.get(firstType)], [secondType, activityMeans.get(secondType)], [thirdType, activityMeans.get(thirdType)]].sort((a, b) => b[1] - a[1]);

	// Find the longest/shortest distance activity
	document.getElementById('longestActivityType').innerText = topThreeMeans[0][0];
	document.getElementById('shortestActivityType').innerText = topThreeMeans[topThreeMeans.length - 1][0];

	// const sortedMeans = [...activityMeans.entries()].sort((a, b) => b[1] - a[1]);

	// Find day of highest average distance of exercise
	// weekdayOrWeekendLonger is the dom element id
	let weekdaySum = 0;	
	let weekdayCnt = 0;	
	let weekendSum = 0;	
	let weekendCnt = 0;	
	
	tweet_array.forEach(element => {
		const day = element.time.getDay();
		// Is weekend
		if (day == 0 || day == 6) { 
			weekendSum += element.distance; 
			weekendCnt ++;
		} else {
			weekdaySum += element.distance; 
			weekdayCnt ++;
		}
	});

	const weekdayAvg = weekdaySum / weekdayCnt;
	const weekendAvg = weekendSum / weekendCnt;

	if (weekendAvg < weekdayAvg) {
		document.getElementById('weekdayOrWeekendLonger').innerText = 'weekdays';
	} else {
		document.getElementById('weekdayOrWeekendLonger').innerText = 'the weekend';
	}
}

function applyFreqSpans(size, firstType, secondType, thirdType) {
	document.getElementById('numberActivities').innerText = size;
	document.getElementById('firstMost').innerText = firstType;
	document.getElementById('secondMost').innerText = secondType;
	document.getElementById('thirdMost').innerText = thirdType;
}

function calculateMeans(activityDist, activityFreq) {
	const means = new Map();
	for (const [type, _] of activityDist) {
		const mean = activityDist.get(type) / activityFreq.get(type);
		means.set(type, mean);
	}
	return means;
}