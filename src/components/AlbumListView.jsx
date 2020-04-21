import React from 'react';
import { Header, Table } from 'semantic-ui-react';

const AlbumListView = (props) => {
  const { albums } = props;

  console.log(albums[0].tracks);

  return (
    <>
      <Table celled inverted unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Artist</Table.HeaderCell>
            <Table.HeaderCell>Plays</Table.HeaderCell>
            <Table.HeaderCell>Tracks</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {albums.map((album) => (
            <Table.Row key={album.mbid}>
              <Table.Cell>{album.name}</Table.Cell>
              <Table.Cell>{album.artist.name}</Table.Cell>
              <Table.Cell>{album.playcount}</Table.Cell>
              <Table.Cell>{album.tracks && album.tracks.length}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Header as="h5" textAlign="center">
        20 of
        {' '}
        {albums.length}
        .
      </Header>
    </>
  );
};

export default AlbumListView;
