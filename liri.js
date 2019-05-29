require("dotenv").config();

var keys = require("./keys.js"); //variable to access keys files
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var request = require("request");

switch (process.argv[2]) {
  case "concert-this":
    getConcert(process.argv.slice(3).join(" "));
    break;

  case "spotify-this-song":
    getSong(process.argv.slice(3).join(" "));
    break;

  case "movie-this":
    getMovie(process.argv.slice(3).join(" "));
    break;

  case "do-what-it-says":
    getRandom();
    break;

  default:
    console.log("Unknown Command. Please try again.");
}

function getConcert(artist) {
  var artist = process.argv.slice(3).join(" ");
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  axios.get(queryURL).then(function(response) {
    console.log("Name of the venue: " + response.data[0].venue.name + "\n");
    console.log("Venue Location: " + response.data[0].venue.city + "\n");
    console.log(
      "Date of event: " +
        moment(response.data[0].datetime).format("MM-DD-YYYY") +
        "\n"
    );

    var printConcert =
      "\nName of the musician: " +
      artist +
      "\nName of the venue: " +
      response.data[0].venue.name +
      "\nVenue location: " +
      response.data[0].venue.city +
      "\n Date of event: " +
      moment(response.data[0].datetime).format("MM-DD-YYYY") +
      "\n";

    fs.appendFile("log.txt", printConcert, function(err) {
      if (err) throw err;
    });
  });
}

function getSong(song) {
  var spotify = new Spotify(keys.spotify);

  if (!song) {
    song = "Dancing With A Stranger";
  }

  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    console.log(
      "Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\n"
    );
    console.log("Song Name: " + data.tracks.items[0].name + "\n");
    console.log("Song Preview Link: " + data.tracks.items[0].href + "\n");
    console.log("Album Name: " + data.tracks.items[0].album.name + "\n");

    // Append text into log.txt file
    var printSong =
      "\nArtist: " +
      data.tracks.items[0].album.artists[0].name +
      "\nSong Name: " +
      data.tracks.items[0].name +
      "\n Preview Link: " +
      data.tracks.items[0].href +
      "\nAlbum Name: " +
      data.tracks.items[0].album.name +
      "\n";

    fs.appendFile("log.txt", printSong, function(err) {
      if (err) throw err;
    });
    //logResults(data)
  });
}

function getMovie(movie) {
  var movie = process.argv.slice(3).join(" ");

  if (!movie) {
    movie = "Mr. Nobody";
  }
  var movieQueryUrl =
    "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.request(movieQueryUrl).then(function(response) {
    console.log("Title: " + response.data.Title + "\n");
    console.log("Year Released: " + response.data.Year + "\n");
    console.log("IMDB Rating: " + response.data.imdbRating + "\n");
    console.log(
      "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n"
    );
    console.log("Country Where Produced: " + response.data.Country + "\n");
    console.log("Language: " + response.data.Language + "\n");
    console.log("Plot: " + response.data.Plot + "\n");
    console.log("Actors/Cast: " + response.data.Actors + "\n");

    //logResults(response);
    var printMovie =
      "\nMovie title: " +
      response.data.Title +
      "\nYear released: " +
      response.data.Year +
      "\nIMDB rating: " +
      response.data.imdbRating +
      "\nRotten Tomatoes rating: " +
      response.data.Ratings[1].Value +
      "\nCountry where produced: " +
      response.data.Country +
      "\nLanguage: " +
      response.data.Language +
      "\nPlot: " +
      response.data.Plot +
      "\nActors: " +
      response.data.Actors +
      "\n";

    fs.appendFile("log.txt", printMovie, function(err) {
      if (err) throw err;
    });
  });
}

function getRandom() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var commands = data.split(",");

      if (commands[0] === "concert-this") {
        getConcert();
      } else if (commands[0] === "movie-this") {
        getMovie(commands[1].replace(/^'(.*)"$/, "$1"));
      } else if (commands[0] === "spotify-this-song") {
        getSong(commands[1].replace(/^'(.*)"$/, "$1"));
      } else {
        console.log("Unknown Command. Please try again.");
      }
    }
  });
}
