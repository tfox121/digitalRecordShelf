import React, { useState } from 'react';
import {
  Form, Input, Modal, Header, Button,
} from 'semantic-ui-react';

import SpotifyAuthButton from './SpotifyAuthButton';

const LastfmInput = (props) => {
  const {
    lastfmUser, setLastfmUser, submitUser, token,
  } = props;
  const [modalDisplayed, setModalDisplayed] = useState(false);


  const action = {
    color: 'red',
    labelPosition: 'right',
    icon: 'lastfm',
    content: 'Search',
  };

  const modal = () => (
    <Modal closeIcon onClose={() => setModalDisplayed(true)} trigger={<Button color="red" labelPosition="right" icon="lastfm" content="Search" />}>
      <Modal.Content>
        <Modal.Description>
          <Header>Connect first?</Header>
          If you think you might want to listen to your albums
          you should connect to Spotify now, otherwise you&apos;ll
          have to reload your selection. It&apos;s not quick...
          <br />
          <br />
          Just want to look at your albums? Go right ahead!
          <SpotifyAuthButton />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );

  const holdAction = (e) => {
    e.preventDefault();
  };

  return (
    <Form action="submit" onSubmit={token || modalDisplayed ? submitUser : holdAction}>
      <Form.Field>
        <Input
          inverted
          action={token || modalDisplayed ? action : modal()}
          placeholder="Your Last.fm Username..."
          value={lastfmUser}
          onChange={(e) => setLastfmUser(e.target.value)}
        />
      </Form.Field>
    </Form>
  );
};

export default LastfmInput;
