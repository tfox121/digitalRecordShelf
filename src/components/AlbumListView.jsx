import React from 'react';
import { Header, Table } from 'semantic-ui-react';

import './AlbumListView.css';
import SpotifyConnectPrompt from './SpotifyConnectPrompt';

const AlbumListView = (props) => {
  const {
    albumSelect, albums, filteredNum, token,
  } = props;

  const handleClick = (event) => {
    const albumInfo = Array.from(event.currentTarget.parentElement.parentElement.children)
      .map((el) => el.innerText).slice(1, 3);
    console.log(albumInfo);
    albumSelect(albumInfo);
  };

  return (
    <>
      <Table celled inverted unstackable selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Artist</Table.HeaderCell>
            <Table.HeaderCell>Plays</Table.HeaderCell>
            {/* <Table.HeaderCell>Tracks</Table.HeaderCell> */}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {albums.map((album) => (
            <Table.Row key={album.name}>
              <Table.Cell><SpotifyConnectPrompt token={token} size="large" handleClick={handleClick} /></Table.Cell>
              <Table.Cell>{album.name}</Table.Cell>
              <Table.Cell>{album.artist.name}</Table.Cell>
              <Table.Cell>{album.playcount}</Table.Cell>
              {/* <Table.Cell>{album.tracks && album.tracks.length}</Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Header inverted as="h5" textAlign="center">
        {albums.length}
        {' of '}
        {filteredNum}
      </Header>
    </>
  );
};

export default AlbumListView;
