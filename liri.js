require("dotenv").config();

var keys = require('./keys.js');

//var spotify = new Spotify(keys.spotify);
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var request = require('request');
var fs = require('fs');

//console.log(client)

var params = {screen_name: 'XavierP75164675'}

var nodeArgs = process.argv;
var movieName = ""

if (process.argv[2] === "my-tweets"){
    myTweets()
}

if (process.argv[2] === "movie-this"){
    movieThis()
    };

function myTweets () {
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    //loops through latest tweets
      for (var i = 0; i < tweets.length; i++) {
          //allows for only 20 tweets to be returned
            if (i > 19){
            break;
        };
    console.log(tweets[i].text);
    // .replace eliminates the +0000 and a space found in each 'created_at' string
    console.log(tweets[i].created_at.replace('+0000 ','')
        );
      } 
    }
 });
}
//    
//movieThis();
function movieThis (){

for (var i = 2; i < nodeArgs.length; i++) {

  // Allows for more than one word to be inputted
  movieName = " " + nodeArgs[i];
}

// OMDB Request
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy" + "&tomatoes=true";

console.log(queryUrl);

request(queryUrl, function(error, response, body) {
    
function movieInfo () {
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
};
  // Shows movieInfo if request is succesful
  if (!error && response.statusCode === 200 && JSON.parse(body).Title != undefined) {
      movieInfo()
  }
  // Shows movieInfo for Mr. Nobody if request is sucessful and if the original search does not return a movie
    else {
        
        console.log("You didn't choose a movie found in the database... Check this movie out instead!");
        request("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {
//                    movieInfo()
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
        })
    }
});
}