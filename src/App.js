import React from 'react';
import './App.css';
import Layout from './hoc/Layout/Layout';
import BurguerBuilder from './containers/BurguerBuilder/BurguerBuilder';

function App() {
  return (
    <div>
      <Layout>
        <BurguerBuilder></BurguerBuilder>
      </Layout>
    </div>
  );
}

export default App;
