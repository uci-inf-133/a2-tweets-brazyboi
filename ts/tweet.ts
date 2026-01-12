class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just") ||
            this.text.toLowerCase().includes("completed")) return "completed_event"; 
        if (this.text.startsWith("Watch") ||
            this.text.toLowerCase().includes("live")) return "live_event";
        if (this.text.startsWith("Achieved")) return "achievement";

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.text.includes(" - ")
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        const writtenPart = this.text.split("- ")[1];
        const words = writtenPart.split(" ");
        return (words.slice(0, words.length - 2)).join(" ");
    }

    //TODO: parse the activity type from the text of the tweet
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        const words = this.text.split(" ");
        return words[findFirstNumericValue(this.text) + 2];
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const words = this.text.split(" ");
        return parseFloat(words[findFirstNumericValue(this.text)]);
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr>This </tr>";
    }
}

function findFirstNumericValue(text: string) {
    const words = text.split(" ");
    
    for (let i = 0; i < words.length; ++i) {
        const isNum = !isNaN(parseFloat(words[i]))
        if (isNum) {
            return i;
        }
    }

    return -1;
}