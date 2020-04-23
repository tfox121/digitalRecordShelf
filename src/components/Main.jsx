import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from 'semantic-ui-react';

import lastfm from '../api/lastfm';
import spotify from '../api/spotify';
// import staticData from '../data/staticData';
import getRandomSubset from '../utils/getRandomSubset';
import history from '../history';
import { getUserTopMusic } from '../utils/lastfm';
import {
  spotifyFindAlbumUri, changeSpotifyMusic, initiateSpotifyWebPlayback,
} from '../utils/spotify';

import LastfmInput from './LastfmInput';
import LoaderBlock from './LoaderBlock';
import ModeSelector from './ModeSelector';
import Player from './Player';
import SpotifyAuthButton from './SpotifyAuthButton';

const TWELVE_MONTH_TOP_ALBUMS_FILTER = 100;
const SIX_MONTH_TOP_ARTIST_FILTER = 75;
const OVERALL_TOP_ALBUMS_NUM = 275;

const Main = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [lastfmUser, setLastfmUser] = useState('');
  const [spotifyToken, setSpotifyToken] = useState('');
  const [overallAlbums, setOverallAlbums] = useState([]);
  const [lastYearAlbums, setLastYearAlbums] = useState([]);
  const [lastSixMonthsArtists, setLastSixMonthsArtists] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [randomAlbums, setRandomAlbums] = useState([]);
  const [extendedArt, setExtendedArt] = useState([]);

  // const getExtendedArt = async (albumList) => {
  //   console.log('Albums', albumList);
  //   const list = [];
  //   await albumList.forEach(async (album, index) => {
  //     try {
  //       const response = await axios.get(`http://coverartarchive.org/release/${album.mbid}`);
  //       console.log(response.data);
  //       list[index] = response.data.images;
  //     } catch (err) {
  //       console.log('No art found');
  //       list[index] = [{ image: album.image[3]['#text'] }];
  //     }
  //   });

  //   console.log('ART', list);
  //   setExtendedArt(list);
  // };

  // useEffect(() => {
  //   getExtendedArt(randomAlbums);
  // }, [randomAlbums]);

  useEffect(() => {
    if (location.hash) {
      const accessToken = location.hash.slice(1).split('&')[0].split('=')[1];
      setSpotifyToken(accessToken);
    }
  }, [location]);

  useEffect(() => {
    if (spotifyToken) {
      try {
        initiateSpotifyWebPlayback(spotifyToken);
      } catch (err) {
        console.error(err);
      }
    }
  }, [spotifyToken]);

  useEffect(() => {
    if (!filteredAlbums.length && (lastYearAlbums && lastSixMonthsArtists)) {
      let albumfiltered = 0;
      const albums = overallAlbums.filter((album) => {
        if (!lastYearAlbums.find(({ name }) => name === album.name)
          && !lastSixMonthsArtists.find(({ name }) => name === album.artist.name)
          && (!album.tracks || album.tracks.length > 4)) {
          return true;
        }

        albumfiltered += 1;

        return false;
      });
      console.log(albumfiltered);
      setFilteredAlbums(albums);
      console.log('FILTERED', albums.length);
    }
  }, [filteredAlbums.length, lastSixMonthsArtists, lastYearAlbums, overallAlbums]);

  useEffect(() => {
    if (filteredAlbums.length) {
      loading === true && setLoading(false);
      setRandomAlbums(getRandomSubset(filteredAlbums, 15));
    }
  }, [filteredAlbums, loading]);

  const submitUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    await getUserTopMusic(lastfm, 'user.getTopAlbums', lastfmUser, '12month', TWELVE_MONTH_TOP_ALBUMS_FILTER, setLastYearAlbums);
    await getUserTopMusic(lastfm, 'user.getTopArtists', lastfmUser, '6month', SIX_MONTH_TOP_ARTIST_FILTER, setLastSixMonthsArtists);
    await getUserTopMusic(lastfm, 'user.getTopAlbums', lastfmUser, 'overall', OVERALL_TOP_ALBUMS_NUM, setOverallAlbums);
    // setFilteredAlbums(staticData);
    setLoading(false);
  };

  const albumSelect = async (albumData) => {
    try {
      const uri = await spotifyFindAlbumUri(spotify, albumData, spotifyToken);
      changeSpotifyMusic(axios, spotify, uri, spotifyToken);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Header as="h1" onClick={() => history.push('/')} content="Record Shelf Rediscovery" />
      <LastfmInput lastfmUser={lastfmUser} setLastfmUser={setLastfmUser} submitUser={submitUser} />
      <SpotifyAuthButton token={spotifyToken} />
      <Player
        spotifyToken={spotifyToken}
        setSpotifyToken={setSpotifyToken}
      />
      <ModeSelector loading={loading} albums={randomAlbums} albumSelect={albumSelect} extendedArt={extendedArt} filteredNum={filteredAlbums.length} token={spotifyToken} />
      <LoaderBlock loading={loading} token={spotifyToken} />
    </ >
  );
};

export default Main;
