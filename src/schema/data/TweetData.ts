// This file contains various objects related to handling of Tweets made by a user

// CUSTOM LIBS
import { Deserializable } from "./Data";

// Object to hold mentioned user
class MentionedUser implements Deserializable {
    // MEMBER DATA
    id_str: string;                                                             // To store rest id of user
    name: string;                                                               // To store user real name
    screen_name: string;                                                        // To store user screen name

    // MEMBER METHODS
    // Method to deserialize input data into this object
    deserialize(data: any): this {
        this.id_str = data.id_str;
        this.name = data.name;
        this.screen_name = data.screen_name;

        return this;
    }
}

// Object to hold additional tweet entites
class TweetEntities implements Deserializable {
    // MEMBER DATA
    hastags: string[];                                                          // To store a list of hastags used
    urls: string[];                                                             // To store a list of urls mentioned
    user_mentions: MentionedUser[];                                             // To store a list of users mentioned
    media: string[];                                                            // To store urls to various media files

    // MEMBER METHODS
    // The constructor
    constructor() {
        this.hastags = [];
        this.urls = [];
        this.user_mentions = [];
        this.media = [];
    }

    // Method to deserialize input data into this object
    deserialize(data: any): this {
        // Extracting user mentions
        for(const user of data['user_mentions']) {
            this.user_mentions.push(new MentionedUser().deserialize(user));
        }

        // Extracting urls
        for(const url of data['urls']) {
            this.urls.push(url.expanded_url);
        }
        
        // Extracting hashtags
        for(const hashtag of data['hashtags']) {
            this.hastags.push(hashtag.text);
        }

        // Extracting media urls (if any)
        if(data['media']) {
            for(const media of data['media']) {
                this.media.push(media['media_url_https']);
            }
        }

        return this;
    }
}

// Object to hold the actual tweet
export class Tweet implements Deserializable {
    // MEMBER DATA
    rest_id: string;                                                        // To store the conversation id
    user_id_str: string;                                                    // To store the rest id of the user who made the tweet
    created_at: string;                                                     // To store the time when the tweet was created
    entities: TweetEntities;                                                // To store additional tweet entities
    full_text: string;                                                      // To store the full text in the tweet
    lang: string;                                                           // To store the language used in the tweet
    quote_count: number;                                                    // To store the number of quotes of the tweet
    reply_count: number;                                                    // To store the number of replies to the tweet
    retweet_count: number;                                                  // To store the number of retweets

    // MEMBER METHODS
    // Method to deserialize input data into this object
    deserialize(data: any): this {
        // Reshaping the input json for convenience
        data.legacy.rest_id = data.rest_id;
        data = data.legacy;

        this.rest_id = data['rest_id'];
        this.created_at = data['created_at'];
        this.user_id_str = data['user_id_str'];
        this.entities = new TweetEntities().deserialize(data['entities']);
        this.full_text = data['full_text'];
        this.lang = data['lang'];
        this.quote_count = data['quote_count'];
        this.reply_count = data['reply_count'];
        this.retweet_count = data['retweet_count'];

        return this;
    }
}