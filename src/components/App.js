import React, { useState } from 'react';
import Login from './Login';
import Register from './Register'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import '../css/app.css';
import Portfolio from './Portfolio';
import Transactions from './Transactions';
function App() {
  const [user, setUser] = useState({});

  
  return (
    <Router>
      <Switch>
        <Route 
          exact path="/signup"
          render={props => <Register {...props}/>}          
        />  
        <Route
          path="/portfolio"
          render={props => <Portfolio user={user} setUser={setUser} {...props}/>}
        />
        <Route
          path="/transactions"
          render={props => <Transactions user={user} {...props}/>}
        />
        <Route 
          path="/"
          render={props => <Login setUser={setUser} {...props}/>}          
        />
      </Switch>
    </Router>
  );
}

export default App;
