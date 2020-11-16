import React from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout';
import BurguerBuilder from './containers/BurguerBuilder/BurguerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';

import {Route,Switch} from 'react-router-dom';

function App() {
  return (
    <div>
      <Layout>
        <Switch>
          <Route path="/checkout" component={Checkout}/>
          <Route path="/orders" component={Orders}/>
          <Route path="/" exact component={BurguerBuilder}/>
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
