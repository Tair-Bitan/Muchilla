import './styles/style.scss';
import { HashRouter as Router, Switch, Route } from "react-router-dom"
import { Home } from './pages/home';
import { MainHeader } from './cmps/MainHeader';


function App() {
  return (
    <div className="App">
      <Router>
        <MainHeader></MainHeader>
        <Switch>
          <Route component={Home} path='/'></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
