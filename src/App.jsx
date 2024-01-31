import "./App.css";
import SideBar from "./components/SideBar";
import { BrowserRouter as Router, Routes as Switch, Route } from "react-router-dom";
import Activity from "./Pages/Activity"
import Chat from "./Pages/Chats";
import Teams from "./Pages/Teams";
import * as IOIcons from "react-icons/io5"

function App() {
  return (
    <>
      <div className="titleBar">
      </div>
      <div className="main">
      <Router>
        <SideBar />
        <Switch>
          <Route path="/" exact Component={Activity}/>
          <Route path="/Chats" Component={Chat}/>
          <Route path="/Teams" Component={Teams}/>
        </Switch>
      </Router>
      <div className="settingsButton">
          <IOIcons.IoSettings className="SettingIcon" />
      </div>
      </div>
    </>
  );
}

export default App;
