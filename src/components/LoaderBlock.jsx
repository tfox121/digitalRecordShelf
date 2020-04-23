import React from 'react';
import {
  Segment, Dimmer, Image, Loader,
} from 'semantic-ui-react';

const LoaderBlock = (props) => {
  const { loading } = props;

  if (!loading) {
    return null;
  }

  return (
    <Segment>
      <Dimmer active>
        <Loader indeterminate>Retrieving Albums</Loader>
      </Dimmer>
      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
    </Segment>
  );
};

export default LoaderBlock;
