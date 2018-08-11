require("dotenv").config();
console.log(
      "------------------------------------------------------------------\n"
    + "Hello! Welcome to LIRI.\n"
    + "To use LIRI:\n"
    + "Type 'my-tweets' to show my latest tweets\n"
    + "Type 'spotify-this-song' and a Song Title to get that Song's Info\n"
    + "Type 'movie-this' and a Movie Name to get that Movie's Info\n"
    + "Type 'do-what-it-says' to see what LIRI says\n"
    + "------------------------------------------------------------------\n"
    );

var keys = require('./keys.js');

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var twitterSN = {screen_name: 'XavierP75164675'};

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');

var fs = require('fs');

var nodeArgs = process.argv;
var userChoice = "";

//ES6 object called during movieThis function to log the info below
var logMovie = (movie) => {
     console.log(
    `Title: ${movie.Title}
    Release Year: ${movie.Year}
    IMDB Rating: ${movie.imdbRating}
    Rotten Tomatoes Rating: ${movie.tomatoRating}
    Country: ${movie.Country}
    Language: ${movie.Language}
    Plot: ${movie.Plot}
    Actors: ${movie.Actors}`
      );
}

for (var i = 3; i < nodeArgs.length; i++) {
    //allows for more than one word upon user input
    // userChoice = userChoice.concat(nodeArgs[i] + "+")
    userChoice = process.argv.slice(3).join(" ")
};
    //calls appropriate functions if the user types "my-tweets", "spotify-this-song", "movie-this" || "do-what-it-says"
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
    client.get('statuses/user_timeline', twitterSN, function (error, tweets, response) {
        if (!error) {
            //loops through latest tweets
            for (var i = 0; i < tweets.length; i++) {
                //allows for only 20 tweets to be returned
                if (i > 19) {
                    break;
                };
                console.log(tweets[i].text.replace("", "\n"));
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
                console.log("Artist: " + track.artists[0].name);
                console.log("Song Title: " + track.name);
                console.log("Album Title: " + track.album.name);
                console.log("Preview URL: " + track.preview_url);
        })
        .catch(function (err) {
            console.log('"Your search returned no results", states LIRI')
        });
}

function movieThis(movieName) {
    // OMDB Request
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy" + "&tomatoes=true";

    request(queryUrl, function (error, response, body) {
        //shows movieInfo if request is succesful
        if (!error && response.statusCode === 200 && JSON.parse(body).Title != undefined) {
            logMovie(JSON.parse(body));
        }
        //shows movieInfo for Mr. Nobody if request is sucessful and if the original search does not return a movie
        else {
            console.log("You didn't choose a movie found in the database... Check this movie out instead!");
            request("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
                logMovie(JSON.parse(body));
            });
        };
    });
};

//splits random.txt into an array, then initializes spotifyThis function calling the second string from the random.txt array
function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        var dataArr = data.split(",");
        spotifyThis(dataArr[1]);
    });
}
//appends all console.log iterations to log.txt & makes sure the log is arranged per console.log line
var log = console.log;
console.log = function(msg) {
    fs.appendFile('./log.txt', msg.replace("", "\n"), function(err) {
        if(err) {
            return log(err);
        }
    });
    log(msg);
}