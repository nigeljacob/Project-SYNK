import * as MDIcons from "react-icons/md";
import {
  Route,
  BrowserRouter as Router,
  Routes as Switch,
} from "react-router-dom";
import "./App.css";
import Activity from "./Pages/Activity";
import Chat from "./Pages/Chats";
import TeamMemberDashboard from "./Pages/TeamMemberDashboard";
import Teams from "./Pages/Teams";
import SideBar from "./components/SideBar";

let result = "";

function App() {
  const detectOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/Mac/i.test(userAgent)) {
      result = "settingsButtonMac";
    } else {
      result = "settingsButtonWindows";
    }
  };

  detectOS();

  return (
    <>
      <div className="titleBar"></div>
      <div className="main">
        <Router>
          <SideBar />
          <Switch>
            <Route path="/" exact Component={Activity} />
            <Route path="/Chats" Component={Chat} />
            <Route path="/Teams" Component={Teams} />
            <Route
              path="/memberDashboard/:teamName"
              Component={TeamMemberDashboard}
            />
          </Switch>
        </Router>
        <div className={result}>
          <MDIcons.MdOutlineSettings className="SettingIcon" />
        </div>
      </div>
    </>
  );
}

export default App;
