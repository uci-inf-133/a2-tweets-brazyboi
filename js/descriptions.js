let currentPage = 0;
let all_my_tweets = null;

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	all_my_tweets = runkeeper_tweets;
	renderTable();	
}

function renderTable() {
	if (!all_my_tweets) 
		return;

	// Filter to just the written tweets
	const tweet_array = all_my_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const written_tweets = tweet_array.filter(tweet => tweet.written);
	const search = document.getElementById('textFilter').value;
	const search_tweets = written_tweets.filter((tweet) => {
		return tweet.text.includes(search);	
	});

	// Take the table rows and add them to the DOM element
	const table = document.getElementById('tweetTable');
	const pageSize = 50;
	const start = currentPage * pageSize;
    const end = start + pageSize;
    const pageTweets = search_tweets.slice(start, end);

    const fragment = document.createDocumentFragment();
    pageTweets.forEach((tweet, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = tweet.getHTMLTableRow(start + index + 1); 
        fragment.appendChild(tr);
    });

    table.innerHTML = ""; 
    table.appendChild(fragment);

	const pageStuff = document.getElementById('pageStuff');
    pageStuff.innerText = `Page ${currentPage + 1} of ${Math.ceil(search_tweets.length / pageSize)}`;

	const next_button = document.getElementById('nextButton');	
	const prev_button = document.getElementById('prevButton');	

    prev_button.disabled = (currentPage === 0);
    next_button.disabled = (end >= search_tweets.length);

	document.getElementById('searchCount').innerText = search_tweets.length;
	document.getElementById('searchText').innerText = search;
}

function addEventHandlerForSearch() {
	const search = document.getElementById('textFilter');
    search.addEventListener('input', () => {
        currentPage = 0;
        renderTable();
    });	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);

	document.getElementById('prevButton').addEventListener('click', () => {
		currentPage--;
		renderTable();
	});

	document.getElementById('nextButton').addEventListener('click', () => {
		currentPage++;
		renderTable();
	});
});

