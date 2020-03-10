import React from "react";
import "./App.css";
import QuizPage from "./components/Quiz-components/QuizPage";
import { Router } from "@reach/router";
import Header from "./components/Header-components/Header";
import Login from "./components/login-components/Login";
import Lobby from "./components/Lobby-components/Lobby";
import socketIOClient from "socket.io-client";
import Gamepage from "./components/Gamepage-components/Gamepage";
const socket = socketIOClient("localhost:8084");

class App extends React.Component {
  state = { loggedIn: false, socket: null };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>

        <Router>
          <Login path="/" socket={socket} />
          <Lobby path="/lobby" socket={socket} />
          <QuizPage path="/quiz" socket={socket} />
          <Gamepage path="/game" socket={socket} />
        </Router>
      </div>
    );
  }
  componentDidMount() {}
}

export default App;
