import { ReactElement } from 'react'
import { HashRouter as Router, Switch, Route } from "react-router-dom"

import './styles/style.scss';
import { Home } from './pages/Home';
import { MainHeader } from './cmps/MainHeader';
import { Login } from './pages/Login';

interface Props {

}

export function App({ }: Props): ReactElement {

  return (
    <div className="App">
      <Router>
        <MainHeader></MainHeader>
        <Switch>
          <Route component={Login} path='/login'></Route>
          <Route component={Home} path='/'></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;





