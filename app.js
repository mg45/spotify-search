require('dotenv').config()

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


const express = require('express');
const PORT = process.env.PORT || 5000
const app = express()

app.listen(PORT, () => {
  //console.log('listening at http:localhost:5000');
})
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/artist-search', (req, res) => {
  //console.log(req.query)
  //res.send(`the user search about ${req.query.artistSearchString}`)

  spotifyApi
    .searchArtists(req.query.artistSearchString)
    .then(data => {
      //console.log('The received artist data from the API: ', data.body.artists.items);
      console.log(data.body.artists.items[0].images[0].url + "img");
      res.render('pages/artist-search-results', { data: data.body.artists, userSearch: req.query.artistSearchString })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  //console.log(req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log(data.body);
      //res.render('pages/albums', { data: data.body.items})
      res.render('pages/albums', { data: data.body, param: req.params })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

});

// Get tracks in an album
app.get('/albums/tracklist/:albumId', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 20, offset: 1 })
    .then(function (data) {
      console.log(data.body.items);
      res.render('pages/tracklist', { data: data.body.items })
    }, function (err) {
      console.log('Something went wrong!', err);
    });
});