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
        const words = this.text.split(" ");
        const numericValIndex = findFirstNumericValue(this.text);
        const num = parseFloat(words[numericValIndex]);
        const unit = words[numericValIndex + 1];
        if (unit == 'km') {
            return num * 1.609;
        }
        return num;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const rowNum = "<td>" + rowNumber.toString() + "</td>";
        const activityType = "<td>" + this.activityType + "</td>"; 

        const firstLinkIndex = findFirstLink(this.text);
        const words = this.text.split(' ');
        const hyperlink = '<a href="' + words[firstLinkIndex] + '">' + ' ' + words[firstLinkIndex] + ' ' + '</a>';
        const before = words.slice(0, firstLinkIndex).join(' ');
        const after = words.slice(firstLinkIndex + 1).join(' ');
        const tweetText = "<td>" + before + hyperlink + after + "</td>";
        const result = "<tr>" + rowNum + activityType + tweetText + "</tr>"; 
        
        return result;
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

function findFirstLink(text: string) {
    const words = text.split(" ");
    for (let i = 0; i < words.length; ++i) {
        if (words[i].startsWith("https://")) {
            return i;
        }
    }
    return -1;
}