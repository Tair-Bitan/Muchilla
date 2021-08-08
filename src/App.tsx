import { ReactElement } from 'react'
import { HashRouter as Router, Switch, Route } from "react-router-dom"

import './styles/style.scss';
import { Home } from './pages/home';
import { Login } from './pages/Login';
import {Map} from './pages/Map';
import { MainHeader } from './cmps/MainHeader';
import { UserDetails } from './pages/UserDetails';
import TripDetails from './pages/TripDetails';
import { MainFooter } from './cmps/MainFooter';

export function App(): ReactElement {

  return (
    <div className="App">
      <Router>
        <MainHeader></MainHeader>
        <Switch>
          <Route component={UserDetails} path='/user/:userId'></Route>
          <Route component={TripDetails} path='/trip/:tripId'></Route>
          <Route component={Login} path='/login'></Route>
          <Route component={Login} path='/signup'></Route>
          <Route component={Map} path='/map'></Route>
          <Route component={Home} path='/'></Route>
        </Switch>
        <MainFooter></MainFooter>
      </Router>
    </div>
  );
}

export default App;





