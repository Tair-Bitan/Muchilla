import { ReactElement } from 'react'
import { HashRouter as Router, Switch, Route } from "react-router-dom"

import './styles/style.scss';
import { Home } from './pages/home';
import { Login } from './pages/Login';
import {SimpleMap} from './pages/Map';
import { MainHeader } from './cmps/MainHeader';

interface Props {

}

export function App({ }: Props): ReactElement {

  return (
    <div className="App">
      <Router>
        <MainHeader></MainHeader>
        <Switch>
          <Route component={Login} path='/login'></Route>
          <Route component={Login} path='/signup'></Route>
          <Route component={SimpleMap} path='/map'></Route>
          <Route component={Home} path='/'></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;





