import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
// import { BrowserRouter as Router } from "react-router-dom"
import store from "./redux/store"
// import * as serviceWorker from './utils/serviceWorker';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// serviceWorker.register();

