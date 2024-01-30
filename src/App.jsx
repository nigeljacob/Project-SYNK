import "./App.css";
import logo from "./logo.svg";
import SomeOther from "./components/SomeOther.jsx";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Now right now
        </a>
        <SomeOther />
      </header>
    </div>
  );
}

export default App;
