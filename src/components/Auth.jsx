import React from 'react';
import { Button } from 'semantic-ui-react';

const Auth = () => (
  <div>
    <Button as="a" href="http://www.last.fm/api/auth/?api_key=41a3c4831b1c49de2f9b2f0b1eb52dcb&cb=http://localhost:3000/auth/callback/">AUTH</Button>
  </div>
);

export default Auth;
