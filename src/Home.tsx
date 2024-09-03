import "./App.css";
import { auth } from "./auth/firebase/Auth";
import { signOut } from "firebase/auth";

function Home() {
  return (
    <header className="App-header">
      <p>I am version {process.env.REACT_APP_VERSION}</p>
      <div>
        <button
          className="gsi-material-button"
          onClick={() => {
            signOut(auth);
          }}
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <span className="gsi-material-button-contents">Logout</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Home;
