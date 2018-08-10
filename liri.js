require("dotenv").config();
console.log(
    "------------------------------------------------------------------\n" +
    "Hello! Welcome to LIRI.\n" +
    "To use LIRI:\n" +
    "Type 'my-tweets' to show my latest tweets\n" +
    "Type 'spotify-this-song' and a Song Title to get that Song's Info\n" +
    "Type 'movie-this' and a Movie Name to get that Movie's Info\n" +
    "Type 'do-what-it-says' to see what LIRI says\n" +
    "------------------------------------------------------------------\n")

var keys = require('./keys.js');

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var fs = require('fs');

//Twitter SN Params
var params = {screen_name: 'XavierP75164675'};

var nodeArgs = process.argv;
var userChoice = "";

for (var i = 3; i < nodeArgs.length; i++) {
    // Allows for more than one word to be inputted to user selection
    userChoice = userChoice.concat(nodeArgs[i] + "+")
};

if (process.argv[2] === "my-tweets") {
    myTweets()
};
if (process.argv[2] === "spotify-this-song" && userChoice != "") {
    spotifyThis(userChoice)
} else if (process.argv[2] === "spotify-this-song" && userChoice === "") {
    spotifyThis('Ace of Base The Sign')
};
if (process.argv[2] === "movie-this") {
    movieThis(userChoice)
};
if (process.argv[2] === "do-what-it-says") {
    doWhat()
};

function myTweets() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //loops through latest tweets
            for (var i = 0; i < tweets.length; i++) {
                //allows for only 20 tweets to be returned
                if (i > 19) {
                    break;
                };
                console.log(tweets[i].text);
                // .replace eliminates the +0000 and a space found in each 'created_at' string
                console.log(tweets[i].created_at.replace('+0000 ', ''));
            };
        };
    });
};

function spotifyThis(songName) {
    spotify
        .search({
            type: 'track',
            query: songName,
            limit: 1
        })
        .then(function (response) {
            var track = response.tracks.items[0];
            console.log(track.artists[0].name);
            console.log(track.name);
            console.log(track.preview_url);
            console.log(track.album.name);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis(movieName) {
    // OMDB Request
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy" + "&tomatoes=true";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        function movieInfo() {
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
            request("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
                //                    movieInfo()
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            });
        };
    });
};

function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        var dataArr = data.split(",");
        // console.log(dataArr)
        spotifyThis(dataArr[1]);
    });
}