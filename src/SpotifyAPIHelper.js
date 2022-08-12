import {Buffer} from 'buffer';

class SpotifyAPIHelper{
  static TOKEN_URL = "https://accounts.spotify.com/api/token";
  static seedrandom = require('seedrandom');
  
  constructor(clientId, clientSecret, artistId){
    this.artistId = artistId;
    this.token = null; //token will need to be set
    if(!clientSecret){
      console.log("Missing API Client Secret...");
    };
    if(!clientId){
      console.log("Missing API Client Id...");
    }
    this.authorizationHeader = `${clientId}:${clientSecret}`
  }

  static generateRandomNumber(min, max, seed){
    let rng = this.seedrandom(seed);
    return Math.floor(rng.quick() * (max - min + 1)) + min;
  }
  // Used to format a query object into string.
  // A query is attached at the end of a request url.
  // eg. https://api.spotify.com/v1/artists/id/albums?limit=50%include_groups=album
  // query is after the ? 
  static createQueryString(queryOptions){
    let query = Object.keys(queryOptions).map((key => {
      let value = queryOptions[key];
      return `${key}=${value}`;
    }));
    return query.join("&");
  }

  async setClientCredentialsToken(){
    const requestOptions = {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(this.authorizationHeader).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: new URLSearchParams(
        {grant_type: 'client_credentials'}
      )
    }
    let response = await fetch(SpotifyAPIHelper.TOKEN_URL, requestOptions)
    let token = await response.json();
    this.token = token;
  }
  
  // using the api token, functions to make requests
  async createRestRequest(url, method){
    const requestOptions = {
      // works without access token??
      headers: {
        'Authorization': `${this.token.token_type} ${this.token.access_token}`
      },
      method: `${method}`,
    }
    let response = await fetch(url, requestOptions);
    let responseJson = await response.json();
    return responseJson;
  }


  // returns a list of all album ids for an artist
  async getAlbumIds(){
    const queryOptions = {
      "limit": "50", //max number of albums per request
      "include_groups": "album", //exclude singles, appears_on and compilation 
    }
    let query = SpotifyAPIHelper.createQueryString(queryOptions);
    const url = `https://api.spotify.com/v1/artists/${this.artistId}/albums?${query}`;
    let response = await this.createRestRequest(url, "GET");
    let albums = response.items;
    let albumIds = albums.map((album) => {
      return album.id;
    });
    return albumIds;
  }

  // returns album objects given a list of album ids
  async getAlbums(albumIds){
    const ALBUM_LIMIT = 20;
    let albumBlocks = [];
    // 2d array where each subarray is of size ALBUM_LIMIT, containing album ids.
    for (let i = 0; i < albumIds.length; i += ALBUM_LIMIT){
      albumBlocks.push(albumIds.slice(i, i + ALBUM_LIMIT));
    }

    // convert album ids into album objects
    for (let i = 0; i < albumBlocks.length; i += 1){
      let idBlock = albumBlocks[i];
      let queryOptions = {
        "ids": idBlock.join(",")
      };
      let query = SpotifyAPIHelper.createQueryString(queryOptions);
      let url = `https://api.spotify.com/v1/albums?${query}`;
      let response = await this.createRestRequest(url, "GET");
      albumBlocks[i] = response.albums;            
    }

    // reduce 2d array of album objects into 1d array 
    let albums = albumBlocks.reduce((prev, next) => {
      return prev.concat(next);
    });
    return albums;
  }

  // returns an object containing information for daily track given a moment date object
  async getDailyTrack(date){
    // get the artist's albums
    let albumIds = await this.getAlbumIds();
    let albums = await this.getAlbums(albumIds);
    // select a daily album based on date seed (date+month+year)
    let dailySeed = date.format('L'); 
    let album = albums[SpotifyAPIHelper.generateRandomNumber(0, albums.length-1, dailySeed)]
    // select a track from the daily album using the same seed
    let tracks = album.tracks.items;
    let track = tracks[SpotifyAPIHelper.generateRandomNumber(0, tracks.length-1, dailySeed)]
    return {
      "album": {
        "name": album.name,
        "image": album.images[0].url,
        "release_date": album.release_date,
        "url": album.external_urls.spotify,
        "uri": album.uri,
      },
      "track": {
        "name": track.name,
        "url": track.external_urls.spotify,
        "uri": track.uri,
      }
    };
  }

    
}

export default SpotifyAPIHelper;