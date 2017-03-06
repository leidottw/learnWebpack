import './style/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

// import reducers form './reducers'
import * as reducers from './reducers';

// import components form './reducers'
import { Blue, Red } from './components';

// Add the reducer to your store on the `routing` key
const store = createStore(
    combineReducers({
        routing: routerReducer,
        ...reducers
    })
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Blue} />
            <Route path="/red" component={Red} />
        </Router>
    </Provider>,
    document.getElementById('container')
);
