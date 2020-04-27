import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './semantic-ui/semantic.less';

import App from './components/App';

if (process.env.NODE_ENV === 'production') {
  console.log = () => { };
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
