function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	


	// Event type counts 
	let numCompletedEvents = 0;
	let numLiveEvents = 0;
	let numAchievements = 0;
	let numMiscellaneous = 0;
	let numWritten = 0;

	tweet_array.forEach(element => {
		if (element.source === 'completed_event') {
			if (element.written) {
				numWritten++;			
			}
			numCompletedEvents++;
		} else if (element.source === 'live_event') {
			numLiveEvents++;
		} else if (element.source === 'achievement') {
			numAchievements++;
		} else if (element.source === 'miscellaneous') {
			numMiscellaneous++;
		}
	});

	// Updating completed events data on the HTML of the page
	document.getElementsByClassName('completedEvents')[0].innerText = numCompletedEvents;	
	const completedPercentage = numCompletedEvents / tweet_array.length * 100;
	const completedSigfigs = computeNumSigFigs(completedPercentage)
	document.getElementsByClassName('completedEventsPct')[0].innerText = completedPercentage.toPrecision(completedSigfigs).toString() + '%';

	// Updating completed events data on the HTML of the page
	document.getElementsByClassName('liveEvents')[0].innerText = numLiveEvents;	
	const livePercentage = numLiveEvents / tweet_array.length * 100;
	const liveSigfigs = computeNumSigFigs(livePercentage)
	document.getElementsByClassName('liveEventsPct')[0].innerText = livePercentage.toPrecision(liveSigfigs).toString() + '%';

	// Updating completed events data on the HTML of the page
	document.getElementsByClassName('achievements')[0].innerText = numAchievements;	
	const achievePercentage = numAchievements / tweet_array.length * 100;
	const achieveSigfigs = computeNumSigFigs(achievePercentage)
	document.getElementsByClassName('achievementsPct')[0].innerText = achievePercentage.toPrecision(achieveSigfigs).toString() + '%';

	// Updating completed events data on the HTML of the page
	document.getElementsByClassName('miscellaneous')[0].innerText = numMiscellaneous;	
	const miscPercentage = numMiscellaneous / tweet_array.length * 100;
	const miscSigfigs = computeNumSigFigs(miscPercentage)
	document.getElementsByClassName('miscellaneousPct')[0].innerText = miscPercentage.toPrecision(miscSigfigs).toString() + '%';

	document.getElementsByClassName('completedEvents')[1].innerText = numCompletedEvents;	
	const writtenPercentage = numWritten / numCompletedEvents  * 100;
	const writtenSigFigs = computeNumSigFigs(writtenPercentage)
	document.getElementsByClassName('written')[0].innerText = numWritten;
	document.getElementsByClassName('writtenPct')[0].innerText = writtenPercentage.toPrecision(writtenSigFigs).toString() + '%';
}

function computeNumSigFigs(percentage) {
	if (isNaN(percentage)) return NaN;
	if (percentage >= 10) return 4;
	if (percentage >= 1) return 3;
	return 2;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function computeNumSigFigs(percentage) {
	if (isNaN(percentage)) return NaN;
	if (percentage >= 10) return 4;
	if (percentage >= 1) return 3;
	return 2;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});