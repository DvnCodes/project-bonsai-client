import React from "react";
import "./App.css";
import QuizPage from "./components/Quiz-components/QuizPage";
import { Router } from "@reach/router";
import Header from "./components/Header-components/Header";
import Login from "./components/login-components/Login";

class App extends React.Component {
  state = { loggedIn: false };
  render() {
    const { loggedIn } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <body>
          {!loggedIn && <Login playerLogin={this.playerLogin} path="/login" />}
          {loggedIn && (
            <Router>
              <Lobby path="/lobby" />
              <QuizPage path="/path" />
            </Router>
          )}
        </body>
      </div>
    );
  }
  playerLogin = () => {
    this.setState({ loggedIn: true });
  };
}

export default App;
