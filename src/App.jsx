import "./App.css";
import SideBar from "./components/SideBar";
import { BrowserRouter as Router, Routes as Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <SideBar />
        <Switch>
          <Route path="/" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
