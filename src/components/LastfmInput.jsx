import React from 'react';
import { Form, Input } from 'semantic-ui-react';

const LastfmInput = (props) => {
  const { lastfmUser, setLastfmUser, submitUser } = props;

  return (
    <Form action="submit" onSubmit={submitUser}>
      <Form.Field>
        <Input
          inverted
          action={{
            color: 'red',
            labelPosition: 'right',
            icon: 'lastfm',
            content: 'Search',
          }}
          placeholder="Your Last.fm Username..."
          value={lastfmUser}
          onChange={(e) => setLastfmUser(e.target.value)}
        />
      </Form.Field>
    </Form>
  );
};

export default LastfmInput;
