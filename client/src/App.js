import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom"
import LandingPage from './components/landingPage';
import Home from './components/home';


//ENVUELVO EL DIV CON UN BROWSERROUTER
function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Switch>
        <Route exact path={"/"}component={LandingPage}/>
        <Route exact path={"/home"}component={Home}/>
      </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
