import React from "react";
import "./App.css";
import QuizPage from "./components/Quiz-components/QuizPage";
import { Router } from "@reach/router";
import Header from "./components/Header-components/Header";
import Login from "./components/login-components/Login";
import Lobby from "./components/Lobby-components/Lobby";
import io from "socket.io-client";
const socket = io("http://localhost", {
  path: "/8080"
});

class App extends React.Component {
  state = { loggedIn: false };

  componentDidMount() {
    socket.on("loginAuthorised", authorized => {
      authorized && this.setState({ loggedIn: true });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <body>
          <Router>
            <Login path="/" />
            <Lobby path="/lobby" />
            <QuizPage path="/quiz" />
          </Router>
        </body>
      </div>
    );
  }
}

export default App;
