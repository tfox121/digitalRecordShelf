import React from 'react';
import { Header, Table } from 'semantic-ui-react';

const AlbumListView = (props) => {
  const { albumSelect, albums } = props;

  const handleClick = (event) => {
    const albumInfo = Array.from(event.currentTarget.children)
      .map((el) => el.innerText).slice(0, 2);
    console.log(albumInfo);
    albumSelect(albumInfo);
  };

  return (
    <>
      <Table celled inverted unstackable selectable>
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
            <Table.Row key={album.name} onClick={handleClick}>
              <Table.Cell>{album.name}</Table.Cell>
              <Table.Cell>{album.artist.name}</Table.Cell>
              <Table.Cell>{album.playcount}</Table.Cell>
              <Table.Cell>{album.tracks && album.tracks.length}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Header inverted as="h5" textAlign="center">
        20 of
        {' '}
        {albums.length}
      </Header>
    </>
  );
};

export default AlbumListView;
